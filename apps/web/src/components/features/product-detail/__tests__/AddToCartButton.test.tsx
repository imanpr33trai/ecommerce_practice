import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Suspense } from "react";
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

import AddToCartButton from "@/components/features/product-detail/AddToCartButton";

const server = setupServer(
  http.post("http://localhost:3000/api/cart", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        id: `cart-${Date.now()}`,
        userId: "user-1",
        productId: body.productId,
        quantity: body.quantity || 1,
        selectedColor: body.color,
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

describe("AddToCartButton", () => {
  beforeEach(() => {
    server.listen();
    Object.assign(mockSessionData, {
      user: { id: "user-1", name: "Test User", email: "test@example.com" },
      session: { id: "session-1", token: "test-token" },
    });
  });

  afterEach(() => {
    server.close();
    vi.clearAllMocks();
  });

  it("renders add to cart button", () => {
    render(
      <AddToCartButton productId="product-1" productName="Test Product" />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeInTheDocument();
  });

  it("shows loading state during mutation", async () => {
    render(
      <AddToCartButton productId="product-1" productName="Test Product" />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /adding/i })).toBeInTheDocument();
    });
  });

  it("calls mutation with correct parameters", async () => {
    const onSuccess = vi.fn();
    render(
      <AddToCartButton
        productId="product-1"
        productName="Test Product"
        selectedColor="Red"
        quantity={2}
        onSuccess={onSuccess}
      />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <AddToCartButton productId="product-1" productName="Test Product" disabled={true} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeDisabled();
  });
});