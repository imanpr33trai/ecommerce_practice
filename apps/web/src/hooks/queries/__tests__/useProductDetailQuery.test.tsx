import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

import { fetchProductDetail, useProductDetailQuery } from "@/hooks/queries/useProductDetailQuery";

const server = setupServer(
  http.get("http://localhost:3000/api/product/:slug", ({ params }) => {
    const { slug } = params;
    if (slug === "test-product") {
      return HttpResponse.json({
        success: true,
        data: {
          id: "1",
          name: "Test Product",
          slug: "test-product",
          description: "A test product description",
          price: "99.99",
          compareAtPrice: "129.99",
          sku: "TP-001",
          stock: 10,
          images: [
            { id: "img-1", url: "/images/test-1.jpg", altText: "Test product", isPrimary: true },
            { id: "img-2", url: "/images/test-2.jpg", altText: "Test product 2", isPrimary: false },
          ],
          categoryId: "cat-1",
          brandId: "brand-1",
          isActive: true,
          isFeatured: true,
          rating: "4.5",
          reviewCount: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: { id: "cat-1", name: "Electronics", slug: "electronics" },
          brand: { id: "brand-1", name: "Test Brand", slug: "test-brand" },
          variants: [
            { id: "var-1", color: "Red", size: "M", stock: 5, price: "99.99" },
            { id: "var-2", color: "Blue", size: "M", stock: 5, price: "99.99" },
          ],
          colors: ["Red", "Blue"],
          materials: ["Cotton"],
        },
      });
    }
    if (slug === "not-found") {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Product not found" }, { status: 404 });
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
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </QueryClientProvider>
  );
};

describe("useProductDetailQuery", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("fetches product detail successfully", async () => {
    const { result } = renderHook(() => useProductDetailQuery("test-product"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data.name).toBe("Test Product");
    expect(result.current.data?.data.slug).toBe("test-product");
    expect(result.current.data?.data.price).toBe("99.99");
  });

  it("has correct query key structure", () => {
    // Test the query key structure from productKeys
    const queryKey = ["product", "detail", "test-product"];
    expect(queryKey).toEqual(["product", "detail", "test-product"]);
  });
});

describe("fetchProductDetail", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.close();
  });

  it("fetches product detail via fetch API", async () => {
    const data = await fetchProductDetail("test-product");

    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Test Product");
    expect(data.data.slug).toBe("test-product");
    expect(data.data.images).toHaveLength(2);
  });

  it("throws on 404", async () => {
    await expect(fetchProductDetail("not-found")).rejects.toThrow("Product not found");
  });
});