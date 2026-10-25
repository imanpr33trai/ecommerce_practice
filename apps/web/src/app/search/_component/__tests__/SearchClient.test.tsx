import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "../../../../../test/utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/search",
  useSearchParams: () => new URLSearchParams(),
}));

import SearchClient from "@/app/search/_component/SearchClient";

const mockSearchResponse = {
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

const server = setupServer(
  http.get("http://localhost:3000/api/product", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    if (search) {
      return HttpResponse.json(mockSearchResponse);
    }
    return HttpResponse.json({
      data: {
        items: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      },
    });
  }),
);

describe("SearchClient", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  it("renders search header", () => {
    render(<SearchClient />);

    expect(screen.getByText("Search Results")).toBeInTheDocument();
    expect(screen.getByText('Showing results for ""')).toBeInTheDocument();
  });

  it("renders search autocomplete", () => {
    render(<SearchClient />);

    expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
  });

  it("renders filters sidebar", () => {
    render(<SearchClient />);

    expect(screen.getByText("Sort By")).toBeInTheDocument();
    expect(screen.getByText("Price Range")).toBeInTheDocument();
  });

  it("shows loading skeletons initially", () => {
    render(<SearchClient />);

    expect(screen.getAllByTestId("product-skeleton")).toHaveLength(8);
  });

  it("shows search results after loading", async () => {
    render(<SearchClient />);

    await waitFor(() => {
      expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
      expect(screen.getByText("Smart Watch")).toBeInTheDocument();
    });
  });

  it("shows results count", async () => {
    render(<SearchClient />);

    await waitFor(() => {
      expect(screen.getByText("Showing 2 of 2 results for \"\"")).toBeInTheDocument();
    });
  });

  it("shows empty state when no results", async () => {
    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return HttpResponse.json({
          data: {
            items: [],
            meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
          },
        });
      }),
    );

    render(<SearchClient />);

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });
  });

  it("shows price range inputs", () => {
    render(<SearchClient />);

    expect(screen.getByLabelText("Min Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Price")).toBeInTheDocument();
  });
});