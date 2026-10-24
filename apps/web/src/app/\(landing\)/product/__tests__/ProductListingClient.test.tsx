import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { ProductListingClient } from "@/app/(landing)/product/ProductListingClient";

// Mock context and hooks
vi.mock("@/context/LayoutContext", () => ({
  LayoutContext: {
    Provider: ({ children }: { children: ReactNode }) => <>{children}</>,
  },
  useLayoutContext: () => ({
    toggleCart: vi.fn(),
  }),
}));

vi.mock("@/context/ShopContext", () => ({
  useShop: () => ({
    addToRecentlyViewed: vi.fn(),
    setQuickViewProduct: vi.fn(),
    compareList: [],
    addToCompare: vi.fn(),
    setCompareOpen: vi.fn(),
    resetFilters: vi.fn(),
  }),
  ShopProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: null,
    }),
  },
}));

vi.mock("@/hooks/queries/useProductsQuery", async () => {
  const actual = await vi.importActual("@/hooks/queries/useProductsQuery");
  return {
    ...actual,
    useProductsQuery: vi.fn(() => ({
      data: {
        data: [
          {
            id: "1",
            name: "Wireless Headphones",
            slug: "wireless-headphones",
            description: "High-quality wireless headphones",
            price: "199.99",
            discountPrice: "249.99",
            sku: "WH-001",
            stock: 50,
            images: [{ id: "img-1", url: "/images/headphones.jpg", altText: "Wireless Headphones" }],
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
            colors: ["#000000"],
            isNew: true,
            isOnSale: true,
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 12,
          totalPages: 1,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isPlaceholderData: false,
    })),
    prefetchProducts: vi.fn().mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    }),
  };
});

// Mock next/navigation
const mockPush = vi.fn();
const mockPathname = "/product";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("ProductListingClient", () => {
  const initialData = {
    data: [
      {
        id: "1",
        name: "Wireless Headphones",
        slug: "wireless-headphones",
        description: "High-quality wireless headphones",
        price: "199.99",
        discountPrice: "249.99",
        sku: "WH-001",
        stock: 50,
        images: [{ id: "img-1", url: "/images/headphones.jpg", altText: "Wireless Headphones" }],
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
        colors: ["#000000"],
        isNew: true,
        isOnSale: true,
      },
    ],
    meta: {
      total: 1,
      page: 1,
      limit: 12,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders product listing with initial data", () => {
    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    expect(screen.getByText("Shop Collection")).toBeInTheDocument();
    expect(screen.getByText("1 products found")).toBeInTheDocument();
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("$199.99")).toBeInTheDocument();
  });

  it("shows filter button", () => {
    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    const filterButton = screen.getByRole("button", { name: /filters/i });
    expect(filterButton).toBeInTheDocument();
  });

  it("opens filter panel on hover", () => {
    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.mouseEnter(filterButton);

    // Filter panel should appear
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("closes filter panel on mouse leave", () => {
    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.mouseEnter(filterButton);

    expect(screen.getByText("Sort By")).toBeInTheDocument();

    fireEvent.mouseLeave(filterButton);

    // Wait for timeout
    return waitFor(() => {
      expect(screen.queryByText("Sort By")).not.toBeInTheDocument();
    });
  });

  it("renders pagination when totalPages > 1", () => {
    const dataWithMultiplePages = {
      ...initialData,
      meta: { total: 25, page: 1, limit: 12, totalPages: 3 },
    };

    render(<ProductListingClient initialData={dataWithMultiplePages} />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders bento card", () => {
    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    expect(screen.getByText("Summer")).toBeInTheDocument();
    expect(screen.getByText("Clearance")).toBeInTheDocument();
    expect(screen.getByText("View Sale")).toBeInTheDocument();
  });

  it("updates URL when filters change", () => {
    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    // Open filter panel
    const filterButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.mouseEnter(filterButton);

    // Click a sort option
    const priceAscOption = screen.getByText("Price: Low to High");
    fireEvent.click(priceAscOption);

    // URL should be updated
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("sort=price_asc"),
      { scroll: false },
    );
  });

  it("shows compare button when items in compare list", () => {
    // Need to mock compareList with items
    vi.mock("@/context/ShopContext", () => ({
      useShop: () => ({
        addToRecentlyViewed: vi.fn(),
        setQuickViewProduct: vi.fn(),
        compareList: [{ id: "1", name: "Test" }],
        addToCompare: vi.fn(),
        setCompareOpen: vi.fn(),
        resetFilters: vi.fn(),
      }),
      ShopProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
    }));

    render(<ProductListingClient initialData={initialData} />, { wrapper: createWrapper() });

    expect(screen.getByRole("button", { name: /compare/i })).toBeInTheDocument();
    expect(screen.getByText("Compare (1)")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    vi.mock("@/hooks/queries/useProductsQuery", async () => {
      const actual = await vi.importActual("@/hooks/queries/useProductsQuery");
      return {
        ...actual,
        useProductsQuery: vi.fn(() => ({
          data: null,
          isLoading: true,
          isError: false,
          error: null,
          isPlaceholderData: false,
        })),
        prefetchProducts: vi.fn().mockResolvedValue(null),
      };
    });

    render(<ProductListingClient initialData={null} />, { wrapper: createWrapper() });

    // Should show loading skeleton
    expect(screen.getByTestId("loading-skeleton-products")).toBeInTheDocument();
  });

  it("handles error state", () => {
    vi.mock("@/hooks/queries/useProductsQuery", async () => {
      const actual = await vi.importActual("@/hooks/queries/useProductsQuery");
      return {
        ...actual,
        useProductsQuery: vi.fn(() => ({
          data: null,
          isLoading: false,
          isError: true,
          error: new Error("Failed to fetch"),
          isPlaceholderData: false,
        })),
        prefetchProducts: vi.fn().mockResolvedValue(null),
      };
    });

    render(<ProductListingClient initialData={null} />, { wrapper: createWrapper() });

    expect(screen.getByText("Unable to load products")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
  });
});