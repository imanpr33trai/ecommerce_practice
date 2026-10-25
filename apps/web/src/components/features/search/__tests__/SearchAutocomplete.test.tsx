import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "../../../../../test/utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@ecommerceNextjs/env/web", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

import SearchAutocomplete from "@/components/features/search/SearchAutocomplete";

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
      limit: 5,
      totalPages: 1,
    },
  },
};

const server = setupServer(
  http.get("http://localhost:3000/api/product", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const limit = url.searchParams.get("limit");

    if (search && search.length >= 2) {
      return HttpResponse.json(mockSearchResponse);
    }
    return HttpResponse.json({ data: { items: [], meta: { total: 0, page: 1, limit: 5, totalPages: 0 } } });
  }),
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

describe("SearchAutocomplete", () => {
  function TestWrapper({ initialValue = "", onChange, onSubmit }: { initialValue?: string; onChange: (value: string) => void; onSubmit: (value: string) => void }) {
    const [value, setValue] = useState(initialValue);
    const handleChange = (newValue: string) => {
      setValue(newValue);
      onChange(newValue);
    };
    return (
      <SearchAutocomplete
        value={value}
        onChange={handleChange}
        onSubmit={onSubmit}
        placeholder="Search products..."
      />
    );
  }

  function renderWithValue(initialValue = "") {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    const Wrapper = () => (
      <TestWrapper
        initialValue={initialValue}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );

    return { onChange, onSubmit, wrapper: <Wrapper /> };
  }

  beforeEach(() => {
    server.listen();
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.close();
  });

  it("renders search input with placeholder", () => {
    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "search");
  });

  it("calls onChange when typing", () => {
    const { wrapper, onChange } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "head" } });

    expect(onChange).toHaveBeenCalledWith("head");
  });

  it("calls onSubmit when pressing Enter", () => {
    const { wrapper, onSubmit } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "headphones" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledWith("headphones");
  });

  it("shows suggestions dropdown when typing 2+ characters", async () => {
    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "he" } });

    await waitFor(() => {
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
    });

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent(/Wireless Headphones/);
    expect(options[1]).toHaveTextContent(/Smart Watch/);
  });

  it("does not show suggestions for less than 2 characters", () => {
    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "h" } });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows loading state while fetching suggestions", async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return fetchPromise.then(() => HttpResponse.json(mockSearchResponse));
      }),
    );

    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "he" } });

    expect(screen.getByText("Searching...")).toBeInTheDocument();

    resolveFetch!(null);
    await waitFor(() => {
      expect(screen.queryByText("Searching...")).not.toBeInTheDocument();
    });
  });

  it("navigates suggestions with arrow keys", async () => {
    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "he" } });

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    // Press ArrowDown to highlight first item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByText("Wireless Headphones")).toHaveAttribute("aria-selected", "true");

    // Press ArrowDown again to highlight second item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByText("Smart Watch")).toHaveAttribute("aria-selected", "true");
  });

  it("submits highlighted suggestion on Enter", async () => {
    const { wrapper, onSubmit } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "he" } });

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledWith("wireless-headphones");
  });

  it("closes dropdown on Escape", async () => {
    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "he" } });

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clicking suggestion calls onSubmit with slug", async () => {
    const { wrapper, onSubmit } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "he" } });

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Wireless Headphones"));

    expect(onSubmit).toHaveBeenCalledWith("wireless-headphones");
  });

  it("shows no suggestions message when results empty", async () => {
    server.use(
      http.get("http://localhost:3000/api/product", () => {
        return HttpResponse.json({ data: { items: [], meta: { total: 0, page: 1, limit: 5, totalPages: 0 } } });
      }),
    );

    const { wrapper } = renderWithValue();
    render(wrapper);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "xyz" } });

    await waitFor(() => {
      expect(screen.getByText("No suggestions found")).toBeInTheDocument();
    });
  });

  it("form submit calls onSubmit", () => {
    const { wrapper, onSubmit } = renderWithValue();
    render(wrapper);

    const form = screen.getByRole("search");
    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith("test");
  });
});