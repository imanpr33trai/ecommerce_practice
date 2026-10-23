import { http, HttpResponse } from "msw";
import type { AppType } from "@ecommerceNextjs/api";
import type { auth } from "@ecommerceNextjs/auth";

// Mock product data
const mockProducts = [
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
  },
];

// Mock cart data
let mockCart: Array<{
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}> = [];

// Mock wishlist data
let mockWishlist: Array<{
  id: string;
  userId: string;
  productId: string;
}> = [];

// Mock user session
let mockSession: {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  };
} | null = {
  user: {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    image: null,
  },
  session: {
    id: "session-1",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    token: "test-token",
  },
};

// Create handlers for MSW
export const handlers = [
  // Auth endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, () => {
    if (!mockSession) {
      return HttpResponse.json({ user: null, session: null }, { status: 401 });
    }
    return HttpResponse.json(mockSession);
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`, async ({ request }) => {
    const body = await request.json();
    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json(mockSession);
    }
    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-up`, async ({ request }) => {
    const body = await request.json();
    mockSession = {
      user: {
        id: "user-new",
        name: body.name,
        email: body.email,
        image: null,
      },
      session: {
        id: "session-new",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        token: "new-token",
      },
    };
    return HttpResponse.json(mockSession);
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`, () => {
    mockSession = null;
    return HttpResponse.json({ success: true });
  }),

  // Product endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search");

    let filtered = [...mockProducts];

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return HttpResponse.json({
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  }),

  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/:slug`, ({ params }) => {
    const product = mockProducts.find((p) => p.slug === params.slug);
    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/:id/reviews`, ({ params }) => {
    return HttpResponse.json({
      data: [
        {
          id: "review-1",
          productId: params.id,
          userId: "user-1",
          rating: 5,
          title: "Great product!",
          comment: "Really happy with this purchase",
          createdAt: new Date().toISOString(),
        },
      ],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
  }),

  // Cart endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, () => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userCart = mockCart.filter((item) => item.userId === mockSession.user.id);
    return HttpResponse.json({ data: userCart });
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, async ({ request }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const newItem = {
      id: `cart-${Date.now()}`,
      userId: mockSession.user.id,
      productId: body.productId,
      quantity: body.quantity || 1,
      selectedColor: body.selectedColor,
      selectedSize: body.selectedSize,
    };
    mockCart.push(newItem);
    return HttpResponse.json({ data: newItem });
  }),

  http.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/:id`, async ({ params, request }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const index = mockCart.findIndex((item) => item.id === params.id && item.userId === mockSession.user.id);
    if (index === -1) {
      return HttpResponse.json({ message: "Cart item not found" }, { status: 404 });
    }
    mockCart[index] = { ...mockCart[index], ...body };
    return HttpResponse.json({ data: mockCart[index] });
  }),

  http.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/:id`, ({ params }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    mockCart = mockCart.filter((item) => item.id !== params.id || item.userId !== mockSession.user.id);
    return HttpResponse.json({ success: true });
  }),

  // Wishlist endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wish`, () => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userWishlist = mockWishlist.filter((item) => item.userId === mockSession.user.id);
    return HttpResponse.json({ data: userWishlist });
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/wish`, async ({ request }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const newItem = {
      id: `wish-${Date.now()}`,
      userId: mockSession.user.id,
      productId: body.productId,
    };
    mockWishlist.push(newItem);
    return HttpResponse.json({ data: newItem });
  }),

  http.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/wish/:id`, ({ params }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    mockWishlist = mockWishlist.filter(
      (item) => item.id !== params.id || item.userId !== mockSession.user.id,
    );
    return HttpResponse.json({ success: true });
  }),

  // User endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, () => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      data: mockSession.user,
    });
  }),

  http.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, async ({ request }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    mockSession.user = { ...mockSession.user, ...body };
    return HttpResponse.json({ data: mockSession.user });
  }),

  // Order endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, () => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      data: [
        {
          id: "order-1",
          userId: mockSession.user.id,
          status: "delivered",
          total: "299.99",
          items: [
            {
              id: "item-1",
              orderId: "order-1",
              productId: "1",
              quantity: 1,
              price: "199.99",
              product: mockProducts[0],
            },
          ],
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }),

  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/order/:id`, ({ params }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      data: {
        id: params.id,
        userId: mockSession.user.id,
        status: "delivered",
        total: "299.99",
        items: [
          {
            id: "item-1",
            orderId: params.id,
            productId: "1",
            quantity: 1,
            price: "199.99",
            product: mockProducts[0],
          },
        ],
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, async ({ request }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    return HttpResponse.json({
      data: {
        id: `order-${Date.now()}`,
        userId: mockSession.user.id,
        status: "pending",
        total: body.total,
        items: body.items,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Address endpoints
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/address`, () => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      data: [
        {
          id: "addr-1",
          userId: mockSession.user.id,
          name: "Home",
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          postalCode: "94102",
          country: "US",
          isDefault: true,
        },
      ],
    });
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/api/address`, async ({ request }) => {
    if (!mockSession) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    return HttpResponse.json({
      data: {
        id: `addr-${Date.now()}`,
        userId: mockSession.user.id,
        ...body,
      },
    });
  }),

  // Health check
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, () => {
    return HttpResponse.json({ status: "ok" });
  }),
];

// Helper to reset mock state
export const resetMocks = () => {
  mockCart = [];
  mockWishlist = [];
  mockSession = {
    user: {
      id: "user-1",
      name: "Test User",
      email: "test@example.com",
      image: null,
    },
    session: {
      id: "session-1",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      token: "test-token",
    },
  };
};

// Helper to set mock session
export const setMockSession = (
  session: typeof mockSession,
) => {
  mockSession = session;
};

// Helper to get mock session
export const getMockSession = () => mockSession;