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

import ReviewSection from "@/components/features/product-detail/ReviewSection";

const server = setupServer(
  http.get("http://localhost:3000/api/review/:productId", ({ params }) => {
    const { productId } = params;
    return HttpResponse.json({
      data: {
        items: [
          {
            id: "review-1",
            productId,
            userId: "user-1",
            rating: 5,
            title: "Great product!",
            comment: "Really happy with this purchase. High quality and fast shipping.",
            createdAt: new Date().toISOString(),
            user: { name: "John Doe", image: null },
          },
          {
            id: "review-2",
            productId,
            userId: "user-2",
            rating: 4,
            title: "Good value",
            comment: "Good product for the price. Would recommend.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            user: { name: "Jane Smith", image: null },
          },
        ],
        meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      },
    });
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

describe("ReviewSection", () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("renders rating summary", () => {
    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={4.5}
        totalReviews={2}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(2 reviews)")).toBeInTheDocument();
  });

  it("renders rating distribution bars", () => {
    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={4.5}
        totalReviews={2}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("5★")).toBeInTheDocument();
    expect(screen.getByText("4★")).toBeInTheDocument();
  });

  it("renders review list", async () => {
    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={4.5}
        totalReviews={2}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText("Great product!")).toBeInTheDocument();
      expect(screen.getByText("Good value")).toBeInTheDocument();
    });
  });

  it("shows sort dropdown", () => {
    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={4.5}
        totalReviews={2}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByLabelText("Sort by:")).toBeInTheDocument();
  });

  it("renders write a review button", () => {
    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={4.5}
        totalReviews={2}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByRole("link", { name: /write a review/i })).toBeInTheDocument();
  });

  it("expands long reviews on read more click", async () => {
    const longReview = "A".repeat(300);
    server.use(
      http.get("http://localhost:3000/api/review/:productId", ({ params }) => {
        const { productId } = params;
        return HttpResponse.json({
          data: {
            items: [
              {
                id: "review-1",
                productId,
                userId: "user-1",
                rating: 5,
                title: "Long review",
                comment: longReview,
                createdAt: new Date().toISOString(),
                user: { name: "John Doe", image: null },
              },
            ],
            meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
          },
        });
      })
    );

    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={5}
        totalReviews={1}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /read more/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /read more/i }));

    expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
  });

  it("shows empty state when no reviews", async () => {
    server.use(
      http.get("http://localhost:3000/api/review/:productId", () => {
        return HttpResponse.json({
          data: { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } },
        });
      })
    );

    render(
      <ReviewSection
        productId="product-1"
        productName="Test Product"
        averageRating={0}
        totalReviews={0}
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText("No reviews yet for Test Product.")).toBeInTheDocument();
    });
  });
});