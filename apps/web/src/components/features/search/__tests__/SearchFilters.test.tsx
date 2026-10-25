import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "../../../../../test/utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

import SearchFilters from "@/components/features/search/SearchFilters";
import type { ProductFilters } from "@/data/product";

const defaultFilters: ProductFilters = {
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

const server = setupServer(
  // Wishlist endpoints
  http.get("http://localhost:3000/api/wish", () => {
    return HttpResponse.json({ items: [] });
  }),
  http.get("http://localhost:3000/api/wish/ids", () => {
    return HttpResponse.json({ ids: [] });
  }),
  // Cart endpoint
  http.get("http://localhost:3000/api/cart", () => {
    return HttpResponse.json({ items: [], total: 0 });
  }),
  // Auth endpoint
  http.get("http://localhost:3000/api/auth/get-session", () => {
    return HttpResponse.json({ user: null, session: null });
  }),
);

describe("SearchFilters", () => {
  const defaultProps = {
    filters: defaultFilters,
    setFilters: vi.fn(),
    searchQuery: "test",
  };

  beforeEach(() => {
    server.listen();
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("renders filter sections", () => {
    render(<SearchFilters {...defaultProps} />);

    expect(screen.getByText("Sort By")).toBeInTheDocument();
    expect(screen.getByText("Price Range")).toBeInTheDocument();
    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
  });

  it("shows active filter chips when filters are applied", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      categories: ["Electronics"],
      materials: ["Leather"],
      colors: ["#FF0000"],
      onSale: true,
      inStock: true,
      rating: 4,
      minPrice: 10,
      maxPrice: 500,
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    expect(screen.getByText("Active:")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove Electronics filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove Leather filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove sale filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove stock filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove rating filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove price filter")).toBeInTheDocument();
  });

  it("removes category filter when clicking X on chip", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      categories: ["Electronics", "Clothing"],
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    fireEvent.click(screen.getByLabelText("Remove Electronics filter"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(filtersWithActive);
    expect(result.categories).toEqual(["Clothing"]);
  });

  it("removes material filter when clicking X on chip", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      materials: ["Leather", "Cotton"],
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    fireEvent.click(screen.getByLabelText("Remove Leather filter"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(filtersWithActive);
    expect(result.materials).toEqual(["Cotton"]);
  });

  it("removes color filter when clicking X on chip", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      colors: ["#FF0000", "#0000FF"],
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    const removeButtons = screen.getAllByLabelText("Remove color filter");
    expect(removeButtons.length).toBeGreaterThan(0);
    fireEvent.click(removeButtons[0]!);

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(filtersWithActive);
    expect(result.colors).toEqual(["#0000FF"]);
  });

  it("toggles sort option", () => {
    render(<SearchFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("Price: Low to High"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    // Also verify the function produces correct result
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.sort).toBe("price_asc");
  });

  it("toggles in stock filter", () => {
    render(<SearchFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("In Stock Only"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.inStock).toBe(true);
  });

  it("toggles on sale filter", () => {
    render(<SearchFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("On Sale"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.onSale).toBe(true);
  });

  it("toggles category filter", () => {
    render(<SearchFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("Electronics"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.categories).toEqual(["Electronics"]);
  });

  it("toggles material filter", () => {
    render(<SearchFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("Cotton"));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.materials).toEqual(["Cotton"]);
  });

  it("toggles color filter", () => {
    render(<SearchFilters {...defaultProps} />);

    const redColorButton = screen.getAllByRole("button", { name: /#FF0000/i })[0];
    fireEvent.click(redColorButton!);

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.colors).toEqual(["#FF0000"]);
  });

  it("toggles rating filter", () => {
    render(<SearchFilters {...defaultProps} />);

    // Find the label with & Up text for 4-star rating (first one)
    const ratingLabels = screen.getAllByText(/& Up/);
    expect(ratingLabels.length).toBeGreaterThan(0);
    fireEvent.click(ratingLabels[0]!);

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.rating).toBe(4);
  });

  it("updates min price", () => {
    render(<SearchFilters {...defaultProps} />);

    const minPriceInput = screen.getByLabelText("Min Price");
    fireEvent.change(minPriceInput, { target: { value: "50" } });

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.minPrice).toBe(50);
  });

  it("updates max price", () => {
    render(<SearchFilters {...defaultProps} />);

    const maxPriceInput = screen.getByLabelText("Max Price");
    fireEvent.change(maxPriceInput, { target: { value: "200" } });

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.any(Function),
    );
    const updaterFn = defaultProps.setFilters.mock.calls[0][0] as (prev: ProductFilters) => ProductFilters;
    const result = updaterFn(defaultFilters);
    expect(result.maxPrice).toBe(200);
  });

  it("resets all filters when clicking Reset", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      categories: ["Electronics"],
      sort: "price_desc",
      minPrice: 50,
      maxPrice: 500,
      onSale: true,
      inStock: true,
      rating: 4,
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(defaultProps.setFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        limit: 20,
        sort: "newest",
        minPrice: 0,
        maxPrice: 100000,
        categories: [],
        materials: [],
        colors: [],
        onSale: undefined,
        inStock: undefined,
        rating: undefined,
      }),
    );
  });

  it("shows mobile filter toggle button", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      categories: ["Electronics"],
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    const mobileToggle = screen.getByRole("button", { name: /filters/i });
    expect(mobileToggle).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // badge count
  });

  it("does not show active chips when no filters applied", () => {
    render(<SearchFilters {...defaultProps} />);

    expect(screen.queryByText("Active:")).not.toBeInTheDocument();
  });

  it("shows filter count badge on mobile", () => {
    const filtersWithActive: ProductFilters = {
      ...defaultFilters,
      categories: ["Electronics", "Clothing"],
      materials: ["Cotton"],
      onSale: true,
    };

    render(<SearchFilters {...defaultProps} filters={filtersWithActive} />);

    // 2 categories + 1 material + 1 sale = 4
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});