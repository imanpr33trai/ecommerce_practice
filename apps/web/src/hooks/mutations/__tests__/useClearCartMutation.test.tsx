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

import { useClearCartMutation } from "@/hooks/mutations/useClearCartMutation";

const server = setupServer(
  http.delete("http://localhost:3000/api/cart", () => {
    return HttpResponse.json({
      success: true,
      message: "Cart cleared",
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

describe("useClearCartMutation", () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("clears cart successfully", async () => {
    const { result } = renderHook(() => useClearCartMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.success).toBe(true);
  });

  it("handles mutation error", async () => {
    server.use(
      http.delete("http://localhost:3000/api/cart", () => {
        return HttpResponse.json({ message: "Failed to clear cart" }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useClearCartMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});