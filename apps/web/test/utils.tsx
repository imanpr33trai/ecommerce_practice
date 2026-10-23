import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// Create a custom render function that includes providers
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

interface WrapperProps {
  children: ReactNode;
}

const TestWrapper: React.FC<WrapperProps> = ({ children }) => {
  const [queryClient] = React.useState(() => createTestQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {},
) => {
  const { queryClient, ...renderOptions } = options;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient ?? createTestQueryClient()}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper, ...renderOptions });
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { renderWithProviders as render };

// Mock data factories
export const createMockProduct = (overrides: Partial<{
  id: string;
  name: string;
  price: number;
  slug: string;
  images: string[];
  description: string;
  category: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}> = {}) => ({
  id: "1",
  name: "Test Product",
  price: 99.99,
  slug: "test-product",
  images: ["/images/product-1.jpg"],
  description: "A test product",
  category: "Electronics",
  brand: "Test Brand",
  inStock: true,
  rating: 4.5,
  reviewCount: 10,
  ...overrides,
});

export const createMockUser = (overrides: Partial<{
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}> = {}) => ({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  image: null,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockSession = (overrides: Partial<{
  user: ReturnType<typeof createMockUser>;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}> = {}) => ({
  user: createMockUser(),
  session: {
    id: "session-1",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    token: "test-token",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides.session,
  },
  ...overrides,
});

export const createMockCartItem = (overrides: Partial<{
  id: string;
  productId: string;
  quantity: number;
  selectedColor: string | undefined;
  selectedSize: string | undefined;
  product: ReturnType<typeof createMockProduct>;
}> = {}) => ({
  id: "cart-1",
  productId: "1",
  quantity: 1,
  selectedColor: undefined,
  selectedSize: undefined,
  product: createMockProduct(),
  ...overrides,
});

// Helper to wait for async operations
export const waitFor = async (callback: () => void | Promise<void>) => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return callback();
};

// Helper to flush promises
export const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    store,
  };
};

// Helper to test component with providers
export const testWithProviders = (
  component: React.ReactElement,
  options: CustomRenderOptions = {},
) => {
  return renderWithProviders(component, options);
};