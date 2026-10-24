import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: {
        user: { id: "user-1", name: "Test User", email: "test@example.com" },
        session: { id: "session-1", token: "test-token" },
      },
    }),
  },
}));

import { useUpdateQuantityMutation } from "@/hooks/mutations/useUpdateQuantityMutation";

const server = setupServer(
  http.put("http://localhost:3000/api/cart/:productId", async ({ request, params }) => {
    const body = (await request.json()) as { quantity: number };
    return HttpResponse.json({
      success: true,
      data: {
        id: params.productId,
        quantity: body.quantity,
        productId: params.productId,
      },
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

describe("useUpdateQuantityMutation", () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("updates quantity successfully", async () => {
    const { result } = renderHook(() => useUpdateQuantityMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        productId: "cart-item-1",
        quantity: 3,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect((result.current.data as { quantity: number } | undefined)?.quantity).toBe(3);
  });

  it("handles mutation error", async () => {
    server.use(
      http.put("http://localhost:3000/api/cart/:productId", () => {
        return HttpResponse.json(
          { success: false, error: "Out of stock" },
          { status: 400 }
        );
      })
    );

    const { result } = renderHook(() => useUpdateQuantityMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        productId: "cart-item-1",
        quantity: 100,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});