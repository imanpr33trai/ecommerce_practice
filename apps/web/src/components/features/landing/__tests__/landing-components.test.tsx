import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { LayoutContext } from "@/context/LayoutContext";
import { ShopProvider } from "@/context/ShopContext";

import { Hero, FeaturedProducts, CategoryGrid, LandingFooter } from "@/components/features/landing";
import type { ProductSingleResponse } from "@/data/product";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createTestWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LayoutContext.Provider value={{ isCartOpen: false, toggleCart: () => {} }}>
                <ShopProvider>
                  {children}
                </ShopProvider>
              </LayoutContext.Provider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: createTestWrapper() });
};

const mockProduct: ProductSingleResponse = {
  id: "1",
  name: "Modern Sofa",
  slug: "modern-sofa",
  description: "A modern sofa for your living room",
  price: "899.99",
  compareAtPrice: "999.99",
  sku: "SOF-001",
  stock: 10,
  images: [{ id: "img-1", url: "/images/sofa.jpg", altText: "Modern Sofa" }],
  categoryId: "cat-1",
  brandId: "brand-1",
  isActive: true,
  isFeatured: true,
  rating: "4.5",
  reviewCount: 50,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: { id: "cat-1", name: "Sofas", slug: "sofa" },
  brand: { id: "brand-1", name: "ModernBrand" },
  colors: ["#D9D9D9", "#3A3A3A"],
  isNew: true,
  isOnSale: false,
};

describe("Hero", () => {
  it("renders product name and price", () => {
    renderWithProviders(<Hero product={mockProduct} />);
    expect(screen.getByText("Modern Sofa")).toBeInTheDocument();
    expect(screen.getByText("$899.99")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders View Product button with correct link", () => {
    renderWithProviders(<Hero product={mockProduct} />);
    const viewProductLink = screen.getByRole("link", { name: /View Product/i });
    expect(viewProductLink).toHaveAttribute("href", "/product/modern-sofa");
  });

  it("renders product image", () => {
    renderWithProviders(<Hero product={mockProduct} />);
    const image = screen.getByAltText("Modern Sofa");
    expect(image).toBeInTheDocument();
  });

  it("renders wishlist button", () => {
    renderWithProviders(<Hero product={mockProduct} />);
    const wishlistButton = screen.getByRole("button", { name: /Add to wishlist/i });
    expect(wishlistButton).toBeInTheDocument();
  });
});

describe("FeaturedProducts", () => {
  const mockProducts = [mockProduct, { ...mockProduct, id: "2", name: "Chair", slug: "chair" }];

  it("renders title and subtitle", () => {
    renderWithProviders(
      <FeaturedProducts
        title="Living Room"
        subtitle="Comfortable seating"
        products={mockProducts}
        categoryLink="/product"
      />
    );
    expect(screen.getByText("Living Room")).toBeInTheDocument();
    expect(screen.getByText("Comfortable seating")).toBeInTheDocument();
  });

  it("renders View Collection button with correct link", () => {
    renderWithProviders(
      <FeaturedProducts
        title="Living Room"
        subtitle="Comfortable seating"
        products={mockProducts}
        categoryLink="/product?category=Sofa"
      />
    );
    const link = screen.getByRole("link", { name: /View Collection/i });
    expect(link).toHaveAttribute("href", "/product%3Fcategory=Sofa");
  });

  it("renders product cards for each product", () => {
    renderWithProviders(
      <FeaturedProducts
        title="Living Room"
        subtitle="Comfortable seating"
        products={mockProducts}
        categoryLink="/product"
      />
    );
    expect(screen.getByText("Modern Sofa")).toBeInTheDocument();
    expect(screen.getByText("Chair")).toBeInTheDocument();
  });

  it("renders scroll left/right buttons", () => {
    renderWithProviders(
      <FeaturedProducts
        title="Living Room"
        subtitle="Comfortable seating"
        products={mockProducts}
        categoryLink="/product"
      />
    );
    const leftButton = screen.getByRole("button", { name: /Scroll left/i });
    const rightButton = screen.getByRole("button", { name: /Scroll right/i });
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
  });

  it("returns null when products array is empty", () => {
    const { container } = renderWithProviders(
      <FeaturedProducts
        title="Living Room"
        subtitle="Comfortable seating"
        products={[]}
        categoryLink="/product"
      />
    );
    // Component returns null, but ThemeProvider adds a script tag
    expect(container.querySelector('[data-testid="featured-products"]')).toBeNull();
  });
});

describe("CategoryGrid", () => {
  const mockCategories = [
    { name: "Sofas", slug: "sofa", image: "/images/sofa.jpg", colSpan: 2 },
    { name: "Chairs", slug: "chair", image: "/images/chair.jpg" },
    { name: "Tables", slug: "table", image: "/images/table.jpg" },
  ];

  it("renders category cards with name and image", () => {
    renderWithProviders(<CategoryGrid categories={mockCategories} />);
    expect(screen.getByText("Sofas")).toBeInTheDocument();
    expect(screen.getByText("Chairs")).toBeInTheDocument();
    expect(screen.getByText("Tables")).toBeInTheDocument();
  });

  it("renders Explore Collection links with correct category query", () => {
    renderWithProviders(<CategoryGrid categories={mockCategories} />);
    const links = screen.getAllByRole("link", { name: /Explore Collection/i });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/product?category=sofa");
    expect(links[1]).toHaveAttribute("href", "/product?category=chair");
    expect(links[2]).toHaveAttribute("href", "/product?category=table");
  });

  it("renders category images", () => {
    renderWithProviders(<CategoryGrid categories={mockCategories} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });

  it("returns null when categories array is empty", () => {
    const { container } = renderWithProviders(<CategoryGrid categories={[]} />);
    // Component returns null, but ThemeProvider adds a script tag
    expect(container.querySelector('[data-testid="category-grid"]')).toBeNull();
  });
});

describe("LandingFooter", () => {
  it("renders company name and tagline", () => {
    renderWithProviders(<LandingFooter />);
    expect(screen.getByText("Nestify")).toBeInTheDocument();
    expect(screen.getByText("Crafting minimal spaces for modern minds.")).toBeInTheDocument();
  });

  it("renders social media icons", () => {
    renderWithProviders(<LandingFooter />);
    expect(screen.getByRole("button", { name: /Instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Twitter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Facebook/i })).toBeInTheDocument();
  });

  it("renders shop links", () => {
    renderWithProviders(<LandingFooter />);
    expect(screen.getByRole("link", { name: /All Products/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sofas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Chairs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tables/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lighting/i })).toBeInTheDocument();
  });

  it("renders company links", () => {
    renderWithProviders(<LandingFooter />);
    expect(screen.getByRole("link", { name: /About Us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shipping/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Returns/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Terms of Service/i })).toBeInTheDocument();
  });

  it("renders newsletter section with email input", () => {
    renderWithProviders(<LandingFooter />);
    expect(screen.getByText("Join our newsletter for 10% off.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subscribe/i })).toBeInTheDocument();
  });

  it("renders copyright notice with current year", () => {
    renderWithProviders(<LandingFooter />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Nestify Inc. All rights reserved.`)).toBeInTheDocument();
  });
});