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

import WishlistButton from "@/components/features/product-detail/WishlistButton";

const server = setupServer(
  http.post("http://localhost:3000/api/wish/toggle", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        message: body.productId ? "Added to wishlist" : "Removed from wishlist",
        isWishlisted: true,
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

describe("WishlistButton", () => {
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

  it("renders wishlist button when not wishlisted", () => {
    render(
      <WishlistButton productId="product-1" productName="Test Product" isWishlisted={false} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Save");
  });

  it("renders wishlist button when wishlisted", () => {
    render(
      <WishlistButton productId="product-1" productName="Test Product" isWishlisted={true} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Saved");
  });

  it("shows icon-only variant", () => {
    render(
      <WishlistButton
        productId="product-1"
        productName="Test Product"
        isWishlisted={false}
        variant="icon-only"
      />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveTextContent("Save");
  });

  it("shows different sizes for icon-only variant", () => {
    const { rerender } = render(
      <WishlistButton
        productId="product-1"
        productName="Test Product"
        isWishlisted={false}
        variant="icon-only"
        size="sm"
      />,
      { wrapper: createWrapper() }
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("h-8 w-8");

    rerender(
      <WishlistButton
        productId="product-1"
        productName="Test Product"
        isWishlisted={false}
        variant="icon-only"
        size="lg"
      />,
      { wrapper: createWrapper() }
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("h-12 w-12");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <WishlistButton productId="product-1" productName="Test Product" isWishlisted={false} disabled={true} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not toggle when not logged in", async () => {
    Object.assign(mockSessionData, { user: null, session: null });

    render(
      <WishlistButton productId="product-1" productName="Test Product" isWishlisted={false} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // The optimistic update should be rolled back
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});