import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Mock the environment
vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

// Import after mocking
import { useAddressMutations } from "@/data/account/use-address-mutations";

// Test server
const server = setupServer(
  http.post("http://localhost:3000/api/address", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: "addr-new",
      },
    });
  }),
  http.put("http://localhost:3000/api/address/:id", async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: params.id,
      },
    });
  }),
  http.put("http://localhost:3000/api/address/:id/default", async ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { id: params.id, isDefault: true },
    });
  }),
  http.delete("http://localhost:3000/api/address/:id", async ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { message: "Address deleted successfully" },
    });
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAddressMutations", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "bypass" });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("creates address successfully", async () => {
    const { result } = renderHook(() => useAddressMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.create.mutate({
        fullName: "New User",
        streetLine1: "789 New St",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "United States",
        isDefault: false,
      });
    });

    await waitFor(() => expect(result.current.create.isSuccess).toBe(true));

    expect(result.current.create.data).toBeDefined();
    expect(result.current.create.data?.data?.id).toBe("addr-new");
  });

  it("updates address successfully", async () => {
    const { result } = renderHook(() => useAddressMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.update.mutate({
        id: "addr-1",
        json: {
          fullName: "Updated User",
          streetLine1: "789 Updated St",
          city: "Chicago",
          state: "IL",
          postalCode: "60601",
          country: "United States",
          isDefault: true,
        },
      });
    });

    await waitFor(() => expect(result.current.update.isSuccess).toBe(true));

    expect(result.current.update.data).toBeDefined();
    expect(result.current.update.data?.id).toBe("addr-1");
  });

  it("sets default address successfully", async () => {
    const { result } = renderHook(() => useAddressMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.setDefault.mutate({ id: "addr-2" });
    });

    await waitFor(() => expect(result.current.setDefault.isSuccess).toBe(true));

    expect(result.current.setDefault.data).toBeDefined();
    expect(result.current.setDefault.data?.isDefault).toBe(true);
  });

  it("deletes address successfully", async () => {
    const { result } = renderHook(() => useAddressMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.delete.mutate({ id: "addr-1" });
    });

    await waitFor(() => expect(result.current.delete.isSuccess).toBe(true));

    expect(result.current.delete.data).toBeDefined();
    expect(result.current.delete.data?.data?.message).toBe("Address deleted successfully");
  });

  it("handles create mutation error", async () => {
    server.use(
      http.post("http://localhost:3000/api/address", () => {
        return HttpResponse.json({ success: false, error: "Validation error" }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useAddressMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.create.mutate({
        fullName: "New User",
        streetLine1: "789 New St",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "United States",
        isDefault: false,
      });
    });

    await waitFor(() => expect(result.current.create.isError).toBe(true));
    expect(result.current.create.error).toBeDefined();
  });
});