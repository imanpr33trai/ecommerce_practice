// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import React from "react";

import { useSearchSuggestionsQuery, prefetchSearchSuggestions } from "../useSearchSuggestionsQuery";
import { fetchSearch } from "../useSearchQuery";

// Mock environment
vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3000");

// Test data
const mockSuggestionsResponse = {
  success: true,
  data: {
    items: [
      {
        id: "1",
        name: "Running Shoes",
        slug: "running-shoes",
        price: 89.99,
        category: { id: "cat1", name: "Footwear", slug: "footwear" },
        images: [{ url: "/images/shoes.jpg" }],
      },
      {
        id: "2",
        name: "Running Shorts",
        slug: "running-shorts",
        price: 29.99,
        category: { id: "cat2", name: "Apparel", slug: "apparel" },
        images: [{ url: "/images/shorts.jpg" }],
      },
    ],
    meta: {
      total: 2,
      page: 1,
      limit: 5,
      totalPages: 1,
    },
  },
};

// MSW Server
const server = setupServer(
  http.get("http://localhost:3000/api/product", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const limit = url.searchParams.get("limit");

    expect(search).toBeDefined();
    expect(limit).toBe("5");

    return HttpResponse.json(mockSuggestionsResponse);
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

describe("useSearchSuggestionsQuery", () => {
  it("should fetch suggestions when query length >= 2", async () => {
    const { result } = renderHook(
      () => useSearchSuggestionsQuery("run"),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSuggestionsResponse);
    expect(result.current.data?.data.items).toHaveLength(2);
  });

  it("should not fetch when query length < 2", async () => {
    const { result } = renderHook(
      () => useSearchSuggestionsQuery("r"),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
  });

  it("should not fetch when query is empty", async () => {
    const { result } = renderHook(
      () => useSearchSuggestionsQuery(""),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should fetch suggestions with correct params", async () => {
    const { result } = renderHook(
      () => useSearchSuggestionsQuery("shoes"),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSuggestionsResponse);
  });

  it("should handle fetch error", async () => {
    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(
      () => useSearchSuggestionsQuery("test"),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it("should refetch when query changes", async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useSearchSuggestionsQuery(query),
      { wrapper, initialProps: { query: "run" } },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Change query
    rerender({ query: "shoe" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSuggestionsResponse);
  });
});

describe("prefetchSearchSuggestions", () => {
  it("should prefetch and return suggestions", async () => {
    const result = await prefetchSearchSuggestions("run");
    expect(result).toEqual(mockSuggestionsResponse);
  });

  it("should return null for short queries", async () => {
    const result = await prefetchSearchSuggestions("r");
    expect(result).toBeNull();
  });

  it("should return null for empty query", async () => {
    const result = await prefetchSearchSuggestions("");
    expect(result).toBeNull();
  });

  it("should throw on fetch error", async () => {
    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(prefetchSearchSuggestions("test")).rejects.toThrow("Failed to fetch search results");
  });
});