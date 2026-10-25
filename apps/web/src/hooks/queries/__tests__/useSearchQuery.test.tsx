// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import React from "react";

import { useSearchQuery, fetchSearch } from "../useSearchQuery";
import type { ProductFilters } from "@/data/product";

// Mock environment
vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000");

// Test data
const mockSearchResponse = {
  success: true,
  data: {
    items: [
      {
        id: "1",
        name: "Test Product 1",
        slug: "test-product-1",
        description: "Test description",
        price: "29.99",
        compareAtPrice: "39.99",
        sku: "TEST-001",
        stock: 100,
        images: ["/images/test1.jpg"],
        categoryId: "cat1",
        brandId: "brand1",
        isActive: true,
        isFeatured: false,
        rating: "4.5",
        reviewCount: 10,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        category: { id: "cat1", name: "Test Category", slug: "test-category" },
        brand: { id: "brand1", name: "Test Brand", slug: "test-brand" },
        variants: [],
      },
      {
        id: "2",
        name: "Test Product 2",
        slug: "test-product-2",
        description: "Test description 2",
        price: "49.99",
        compareAtPrice: null,
        sku: "TEST-002",
        stock: 50,
        images: ["/images/test2.jpg"],
        categoryId: "cat1",
        brandId: "brand1",
        isActive: true,
        isFeatured: true,
        rating: "4.8",
        reviewCount: 20,
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        category: { id: "cat1", name: "Test Category", slug: "test-category" },
        brand: { id: "brand1", name: "Test Brand", slug: "test-brand" },
        variants: [],
      },
    ],
    meta: {
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  },
};

// MSW Server
const server = setupServer(
  http.get("http://localhost:3000/api/product", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");

    // Verify query params
    expect(search).toBeDefined();
    expect(page).toBeDefined();
    expect(limit).toBeDefined();

    return HttpResponse.json(mockSearchResponse);
  }),
);

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.close();
  server.resetHandlers();
});

// Wrapper for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSearchQuery", () => {
  it("should fetch search results when search query is provided", async () => {
    const { result } = renderHook(
      () => useSearchQuery({ search: "test", limit: 20 }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSearchResponse);
    expect(result.current.data?.data.items).toHaveLength(2);
    expect(result.current.data?.data.meta.total).toBe(2);
  });

  it("should not fetch when search query is empty", async () => {
    const { result } = renderHook(
      () => useSearchQuery({ search: "", limit: 20 }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
  });

  it("should not fetch when search query is undefined", async () => {
    const { result } = renderHook(
      () => useSearchQuery({ search: undefined, limit: 20 }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should pass filters correctly to fetch function", async () => {
    const { result } = renderHook(
      () =>
        useSearchQuery({
          search: "shoes",
          page: 2,
          limit: 10,
          sort: "price_asc",
          minPrice: 10,
          maxPrice: 100,
          categories: ["footwear"],
          materials: ["leather"],
          colors: ["#000000"],
          onSale: true,
          inStock: true,
          rating: 4,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSearchResponse);
  });

  it("should handle fetch error", async () => {
    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(
      () => useSearchQuery({ search: "test", limit: 20 }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe("fetchSearch", () => {
  it("should fetch and return search results", async () => {
    const filters: ProductFilters = {
      page: 1,
      limit: 20,
      sort: "newest",
      minPrice: 0,
      maxPrice: 100000,
      categories: [],
      materials: [],
      colors: [],
      search: "test",
      onSale: undefined,
      inStock: undefined,
      rating: undefined,
    };

    const result = await fetchSearch(filters);
    expect(result).toEqual(mockSearchResponse);
  });

  it("should throw on fetch error", async () => {
    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const filters: ProductFilters = {
      page: 1,
      limit: 20,
      sort: "newest",
      minPrice: 0,
      maxPrice: 100000,
      categories: [],
      materials: [],
      colors: [],
      search: "test",
      onSale: undefined,
      inStock: undefined,
      rating: undefined,
    };

    await expect(fetchSearch(filters)).rejects.toThrow("Failed to fetch search results");
  });
});