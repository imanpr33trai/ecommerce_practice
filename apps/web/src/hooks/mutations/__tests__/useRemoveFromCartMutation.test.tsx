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

import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";

const server = setupServer(
  http.delete("http://localhost:3000/api/cart/:productId", ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.productId,
        message: "Item removed",
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

describe("useRemoveFromCartMutation", () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("removes item from cart successfully", async () => {
    const { result } = renderHook(() => useRemoveFromCartMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("cart-item-1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.success).toBe(true);
  });

  it("handles mutation error", async () => {
    server.use(
      http.delete("http://localhost:3000/api/cart/:productId", () => {
        return HttpResponse.json({ message: "Item not found" }, { status: 404 });
      })
    );

    const { result } = renderHook(() => useRemoveFromCartMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("non-existent-item");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});