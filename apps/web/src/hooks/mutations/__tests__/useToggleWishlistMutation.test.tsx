import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Mock the environment and auth
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

// Import after mocking
import { useToggleWishlistMutation } from "@/hooks/mutations/useToggleWishlistMutation";

// Test server
const server = setupServer(
  http.post("http://localhost:3000/api/wish/toggle", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        message: body.productId ? "Added to wishlist" : "Removed from wishlist",
        isWishlisted: true,
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

describe("useToggleWishlistMutation", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("toggles wishlist successfully", async () => {
    const { result } = renderHook(() => useToggleWishlistMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("product-1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data.message).toBe("Added to wishlist");
  });

  it("handles mutation error", async () => {
    // Override server for error case
    server.use(
      http.post("http://localhost:3000/api/wish/toggle", () => {
        return HttpResponse.json({ success: false, error: "Failed to update" }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useToggleWishlistMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate("product-1");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});