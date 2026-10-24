import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
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

import { fetchCart, useCartQuery } from "@/hooks/queries/useCartQuery";

const server = setupServer(
  http.get("http://localhost:3000/api/cart", () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: "cart-1",
        items: [
          {
            id: "cart-item-1",
            quantity: 2,
            color: "Red",
            productId: "product-1",
            product: {
              id: "product-1",
              name: "Test Product",
              slug: "test-product",
              price: "99.99",
              category: { id: "cat-1", name: "Electronics", slug: "electronics" },
              discountPrice: "79.99",
              stock: 10,
              colors: ["Red", "Blue"],
              images: [
                { id: "img-1", url: "/images/test-1.jpg", altText: "Test product" },
              ],
            },
          },
        ],
        subtotal: 159.98,
        totalItems: 2,
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
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useCartQuery", () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("fetches cart successfully", async () => {
    const { result } = renderHook(() => useCartQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data.id).toBe("cart-1");
    expect(result.current.data?.data.items).toHaveLength(1);
    expect(result.current.data?.data.totalItems).toBe(2);
    expect(result.current.data?.data.subtotal).toBe(159.98);
  });

  it("has correct query key structure", () => {
    const queryKey = ["cart", "list"];
    expect(queryKey).toEqual(["cart", "list"]);
  });
});

describe("fetchCart", () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.close();
  });

  it("fetches cart via fetch API", async () => {
    const data = await fetchCart();

    expect(data).toBeDefined();
    expect(data?.success).toBe(true);
    expect(data?.data.id).toBe("cart-1");
    expect(data?.data.items).toHaveLength(1);
  });

  it("returns null on 401", async () => {
    server.use(
      http.get("http://localhost:3000/api/cart", () => {
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      })
    );

    const data = await fetchCart();
    expect(data).toBeNull();
  });

  it("throws on other errors", async () => {
    server.use(
      http.get("http://localhost:3000/api/cart", () => {
        return HttpResponse.json({ message: "Server error" }, { status: 500 });
      })
    );

    await expect(fetchCart()).rejects.toThrow("Failed to fetch cart");
  });
});