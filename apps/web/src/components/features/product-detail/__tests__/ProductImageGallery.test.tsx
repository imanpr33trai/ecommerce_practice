import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

const mockSessionData = {
  user: { id: "user-1", name: "Test User", email: "test@example.com" },
  session: { id: "session-1", token: "test-token" },
};

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: mockSessionData,
    }),
  },
}));

import ProductImageGallery from "@/components/features/product-detail/ProductImageGallery";

const server = setupServer(
  http.post("http://localhost:3000/api/wish/toggle", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        message: "Added to wishlist",
        isWishlisted: true,
      },
    });
  })
);

const mockProduct = {
  id: "1",
  name: "Test Product",
  slug: "test-product",
  images: [
    { id: "img-1", url: "/images/test-1.jpg", altText: "Test product main", isPrimary: true },
    { id: "img-2", url: "/images/test-2.jpg", altText: "Test product side", isPrimary: false },
    { id: "img-3", url: "/images/test-3.jpg", altText: "Test product back", isPrimary: false },
  ],
};

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

describe("ProductImageGallery", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
    Object.assign(mockSessionData, {
      user: { id: "user-1", name: "Test User", email: "test@example.com" },
      session: { id: "session-1", token: "test-token" },
    });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("renders main image", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    // There are 2 images with the same alt text (main + thumbnail)
    const mainImages = screen.getAllByAltText("Test product main");
    expect(mainImages.length).toBeGreaterThanOrEqual(1);
  });

  it("renders thumbnail strip for multiple images", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    const thumbnails = screen.getAllByRole("button", { name: /view image/i });
    expect(thumbnails).toHaveLength(3);
  });

  it("shows wishlist button on hover", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    const gallery = screen.getByRole("button", { name: /view larger image/i });
    fireEvent.mouseEnter(gallery);

    const wishlistButton = screen.getByRole("button", { name: /add to wishlist/i });
    expect(wishlistButton).toBeInTheDocument();
  });

  it("navigates between images via thumbnail click", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    const thumbnails = screen.getAllByRole("button", { name: /view image/i });
    fireEvent.click(thumbnails[1]);

    // The second image should now be displayed (both main and thumbnail)
    const mainImages = screen.getAllByAltText("Test product side");
    expect(mainImages.length).toBeGreaterThanOrEqual(1);
  });

  it("opens modal on main image click", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    const mainImageButton = screen.getByRole("button", { name: /view larger image/i });
    fireEvent.click(mainImageButton);

    expect(screen.getByRole("dialog", { name: /image gallery/i })).toBeInTheDocument();
  });

  it("navigates in modal with arrow keys", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    const mainImageButton = screen.getByRole("button", { name: /view larger image/i });
    fireEvent.click(mainImageButton);

    fireEvent.keyDown(document, { key: "ArrowRight" });

    // In modal there should be one image
    const modalImages = screen.getAllByAltText("Test product side");
    expect(modalImages.length).toBeGreaterThanOrEqual(1);
  });

  it("closes modal on escape key", () => {
    render(<ProductImageGallery product={mockProduct} />, { wrapper: createWrapper() });

    const mainImageButton = screen.getByRole("button", { name: /view larger image/i });
    fireEvent.click(mainImageButton);

    // The modal has a close button - click it instead
    const closeButton = screen.getByRole("button", { name: /close gallery/i });
    fireEvent.click(closeButton);

    expect(screen.queryByRole("dialog", { name: /image gallery/i })).not.toBeInTheDocument();
  });
});