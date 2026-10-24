import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
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
import { useUserAddressQuery } from "@/data/account/use-user-address";

// Test server
const server = setupServer(
  http.get("http://localhost:3000/api/address", () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: "addr-1",
          fullName: "John Doe",
          streetLine1: "123 Main St",
          streetLine2: "Apt 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "United States",
          isDefault: true,
        },
        {
          id: "addr-2",
          fullName: "Jane Smith",
          streetLine1: "456 Oak Ave",
          streetLine2: "",
          city: "Los Angeles",
          state: "CA",
          postalCode: "90001",
          country: "United States",
          isDefault: false,
        },
      ],
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

describe("useUserAddressQuery", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "bypass" });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("fetches user addresses successfully", async () => {
    const { result } = renderHook(() => useUserAddressQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(2);
    expect(result.current.data?.[0].id).toBe("addr-1");
    expect(result.current.data?.[0].fullName).toBe("John Doe");
    expect(result.current.data?.[0].isDefault).toBe(true);
    expect(result.current.data?.[1].isDefault).toBe(false);
  });

  it("handles empty addresses", async () => {
    server.use(
      http.get("http://localhost:3000/api/address", () => {
        return HttpResponse.json({
          success: true,
          data: [],
        });
      })
    );

    const { result } = renderHook(() => useUserAddressQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("handles fetch error", async () => {
    server.use(
      http.get("http://localhost:3000/api/address", () => {
        return HttpResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useUserAddressQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});