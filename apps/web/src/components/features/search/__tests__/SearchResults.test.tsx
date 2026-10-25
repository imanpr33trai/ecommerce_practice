import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../../../test/utils";
import React from "react";
import type { SearchResponse } from "@/hooks/queries/useSearchQuery";
import SearchResults from "@/components/features/search/SearchResults";

// Mock the useSearchQuery hook
vi.mock("@/hooks/queries/useSearchQuery", () => ({
  useSearchQuery: vi.fn(),
}));

import { useSearchQuery } from "@/hooks/queries/useSearchQuery";

const mockSearchResponse: SearchResponse = {
  success: true,
  data: {
    items: [
      {
        id: "1",
        name: "Wireless Headphones",
        slug: "wireless-headphones",
        description: "High-quality wireless headphones",
        price: "199.99",
        compareAtPrice: "249.99",
        sku: "WH-001",
        stock: 50,
        images: ["/images/headphones.jpg"],
        categoryId: "cat-1",
        brandId: "brand-1",
        isActive: true,
        isFeatured: true,
        rating: "4.5",
        reviewCount: 120,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: { id: "cat-1", name: "Electronics", slug: "electronics" },
        brand: { id: "brand-1", name: "AudioTech", slug: "audiotech" },
        variants: [],
        isNew: false,
        isOnSale: true,
        discountPrice: "249.99",
        colors: ["#FF0000", "#000000"],
      },
      {
        id: "2",
        name: "Smart Watch",
        slug: "smart-watch",
        description: "Latest smart watch with health tracking",
        price: "299.99",
        compareAtPrice: "349.99",
        sku: "SW-001",
        stock: 30,
        images: ["/images/watch.jpg"],
        categoryId: "cat-1",
        brandId: "brand-2",
        isActive: true,
        isFeatured: true,
        rating: "4.8",
        reviewCount: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: { id: "cat-1", name: "Electronics", slug: "electronics" },
        brand: { id: "brand-2", name: "TechWear", slug: "techwear" },
        variants: [],
        isNew: false,
        isOnSale: true,
        discountPrice: "349.99",
        colors: ["#FFFFFF", "#000000"],
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

const createMockQueryResult = (overrides: Partial<{
  data: SearchResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: Error | null;
}> = {}) => ({
  data: overrides.data,
  isLoading: overrides.isLoading ?? false,
  isError: overrides.isError ?? false,
  isFetching: overrides.isFetching ?? false,
  error: overrides.error ?? null,
  isSuccess: !overrides.isLoading && !overrides.isError && !!overrides.data,
  isPending: overrides.isLoading,
  status: overrides.isLoading ? "loading" : overrides.isError ? "error" : "success",
  fetchStatus: overrides.isFetching ? "fetching" : "idle",
  failureCount: 0,
  failureReason: null,
  isStale: false,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  refetch: vi.fn(),
  remove: vi.fn(),
});

describe("SearchResults", () => {
  const defaultProps = {
    searchQuery: "test",
    filters: {
      page: 1,
      limit: 20,
      sort: "newest" as const,
      minPrice: 0,
      maxPrice: 100000,
      categories: [] as string[],
      materials: [] as string[],
      colors: [] as string[],
      onSale: undefined as boolean | undefined,
      inStock: undefined as boolean | undefined,
      rating: undefined as number | undefined,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeletons while fetching", () => {
    vi.mocked(useSearchQuery).mockReturnValue(
      createMockQueryResult({ isLoading: true }),
    );

    render(<SearchResults {...defaultProps} />);

    // LoadingSkeleton with type="products" renders a grid with skeleton items
    const grids = document.querySelectorAll("div.grid.grid-cols-1.gap-6");
    expect(grids.length).toBeGreaterThan(0);
  });

  it("shows products when search results load", () => {
    vi.mocked(useSearchQuery).mockReturnValue(
      createMockQueryResult({ data: mockSearchResponse }),
    );

    render(<SearchResults {...defaultProps} />);

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Smart Watch")).toBeInTheDocument();
  });

  it("shows results info with count", () => {
    vi.mocked(useSearchQuery).mockReturnValue(
      createMockQueryResult({ data: mockSearchResponse }),
    );

    render(<SearchResults {...defaultProps} />);

    // Text is split across multiple spans - check for partial matches
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText(/of/)).toBeInTheDocument();
    expect(screen.getByText(/results for/)).toBeInTheDocument();
    expect(screen.getByText(/test/)).toBeInTheDocument();
  });

  it("shows error message when fetch fails", () => {
    vi.mocked(useSearchQuery).mockReturnValue(
      createMockQueryResult({ isError: true, error: new Error("Failed to fetch") }),
    );

    render(<SearchResults {...defaultProps} />);

    expect(screen.getByText("Something went wrong while searching.")).toBeInTheDocument();
    expect(screen.getByText("Please try again later.")).toBeInTheDocument();
  });

  it("shows empty state when no results", () => {
    const emptyResponse: SearchResponse = {
      ...mockSearchResponse,
      data: {
        ...mockSearchResponse.data,
        items: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      },
    };

    vi.mocked(useSearchQuery).mockReturnValue(
      createMockQueryResult({ data: emptyResponse }),
    );

    render(<SearchResults {...defaultProps} />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    // Text is split across multiple text nodes, use regex
    expect(screen.getByText(/We couldn't find any products matching "test"/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse all products/i })).toBeInTheDocument();
  });

  it("shows updating indicator when refetching", () => {
    vi.mocked(useSearchQuery).mockReturnValue(
      createMockQueryResult({ data: mockSearchResponse, isFetching: true }),
    );

    render(<SearchResults {...defaultProps} />);

    expect(screen.getByText("Updating results...")).toBeInTheDocument();
  });
});