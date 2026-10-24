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
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";

// Test server
const server = setupServer(
  http.post("http://localhost:3000/api/cart", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        id: `cart-${Date.now()}`,
        userId: "user-1",
        productId: body.productId,
        quantity: body.quantity || 1,
        selectedColor: body.color,
        selectedSize: body.size,
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

describe("useAddToCartMutation", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("adds item to cart successfully", async () => {
    const { result } = renderHook(() => useAddToCartMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        productId: "product-1",
        quantity: 1,
        color: "Red",
        size: "M",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data.productId).toBe("product-1");
    expect(result.current.data?.data.quantity).toBe(1);
  });

  it("handles mutation error", async () => {
    // Override server for error case
    server.use(
      http.post("http://localhost:3000/api/cart", () => {
        return HttpResponse.json({ message: "Out of stock" }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useAddToCartMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        productId: "product-1",
        quantity: 100,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});