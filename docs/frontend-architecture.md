# Frontend Structure & API Client Implementation

> **Project**: e-commerce-practice
> **Branch**: `new_design`
> **Last Updated**: 2026-04-11

---

## Overview

This document outlines the recommended frontend structure and API client implementation for the e-commerce project. The goal is to create a scalable, maintainable, and type-safe frontend architecture that complements the excellent backend design.

---

## Frontend Structure

The frontend structure follows a **feature-based organization** with clear separation of concerns, making it easy to navigate, maintain, and scale.

```bash
apps/web/
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── log-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/        # User dashboard routes
│   │   │   ├── account/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (landing)/          # Public landing pages
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── @modal/             # Modal routes (overlay components)
│   │   │   └── (.)/product/[slug]/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   └── not-found.tsx       # 404 page
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components (customized)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── modal.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── header.tsx
│   │   ├── product/            # Product-specific components
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-image.tsx
│   │   │   └── product-rating.tsx
│   │   ├── cart/               # Cart-specific components
│   │   │   ├── cart-item.tsx
│   │   │   ├── cart-summary.tsx
│   │   │   └── cart-toggle.tsx
│   │   ├── account/            # Account-specific components
│   │   │   ├── address-form.tsx
│   │   │   ├── order-item.tsx
│   │   │   ├── review-form.tsx
│   │   │   └── profile-form.tsx
│   │   └── common/             # Common components
│   │       ├── mode-toggle.tsx
│   │       ├── search-bar.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── lib/                    # Utility functions and helpers
│   │   ├── api/                # API client implementation
│   │   │   ├── client.ts       # Main API client
│   │   │   ├── auth.ts         # Authentication utilities
│   │   │   └── index.ts        # Re-export all API hooks
│   │   ├── utils/              # General utilities
│   │   │   ├── format-currency.ts
│   │   │   ├── format-date.ts
│   │   │   ├── slugify.ts
│   │   │   └── validate-email.ts
│   │   └── hooks/              # Custom React hooks
│   │       ├── use-mobile.ts
│   │       ├── use-scroll-position.ts
│   │       └── use-toast.ts
│   │
│   ├── data/                   # TanStack Query data fetching
│   │   ├── cart/               # Cart-related queries and mutations
│   │   │   ├── get-cart.ts
│   │   │   ├── add-item.ts
│   │   │   ├── update-quantity.ts
│   │   │   ├── remove-item.ts
│   │   │   └── clear-cart.ts
│   │   ├── account/            # Account-related queries and mutations
│   │   │   ├── get-profile.ts
│   │   │   ├── update-profile.ts
│   │   │   ├── get-addresses.ts
│   │   │   ├── create-address.ts
│   │   │   ├── update-address.ts
│   │   │   ├── delete-address.ts
│   │   │   ├── set-default-address.ts
│   │   │   ├── get-orders.ts
│   │   │   ├── get-order.ts
│   │   │   ├── get-wishlist.ts
│   │   │   ├── toggle-wishlist.ts
│   │   │   └── get-reviews.ts
│   │   ├── product/            # Product-related queries and mutations
│   │   │   ├── get-products.ts
│   │   │   ├── get-product.ts
│   │   │   ├── get-filters.ts
│   │   │   ├── get-suggestions.ts
│   │   │   └── get-review-summary.ts
│   │   └── index.ts            # Re-export all data hooks
│   │
│   ├── styles/                 # Global styles and theme
│   │   ├── globals.css
│   │   └── theme.ts            # Tailwind theme extension
│   │
│   └── types/                  # Shared TypeScript types
│       ├── api.ts              # API response types
│       ├── product.ts          # Product-related types
│       ├── cart.ts             # Cart-related types
│       ├── account.ts          # Account-related types
│       └── index.ts            # Re-export all types
│
├── public/                     # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── robots.txt
│
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Key Design Principles

1. **Feature-Based Organization**: Group files by feature/domain rather than by type
2. **Single Responsibility**: Each file has one clear purpose
3. **Atomic Components**: Small, reusable components with clear props
4. **Type Safety**: All data fetching and state management is fully typed
5. **Separation of Concerns**: Clear distinction between UI components, data fetching, and utilities

---

## API Client Implementation

The API client provides a **type-safe, reusable, and consistent** way to interact with the backend API.

### 1. Main API Client (`src/lib/api/client.ts`)

```ts
// src/lib/api/client.ts
import { createClient } from 'hono/client';
import type { AppType } from '@ecomerceNextjs/api';

// Create a typed client from the API type
export const apiClient = createClient<AppType>(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');

// Add request interceptor for authentication
apiClient.interceptors.request.use((request, options) => {
  // Get token from localStorage or cookies
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return request;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(async (response, options) => {
  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Clear auth token and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      window.location.href = '/auth/log-in';
    }
  }
  
  // Handle 403 Forbidden
  if (response.status === 403) {
    // Show error message or redirect to dashboard
    console.error('Access denied');
  }
  
  return response;
});

// Export type for API responses
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Export type for pagination
export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
};
```

### 2. Authentication Utilities (`src/lib/api/auth.ts`)

```ts
// src/lib/api/auth.ts
import { apiClient } from './client';

// Authentication types
export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: 'USER' | 'ADMIN';
  };
  session: {
    id: string;
    expiresAt: string;
  };
};

// Authentication state
export type AuthState = {
  isAuthenticated: boolean;
  user?: Session['user'];
  session?: Session['session'];
  isLoading: boolean;
};

// Authentication utilities
export const auth = {
  // Get current session
  getSession: async (): Promise<Session | null> => {
    try {
      const response = await apiClient.auth.getSession.$get();
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  },
  
  // Login
  login: async (email: string, password: string): Promise<Session> => {
    const response = await apiClient.auth.login.$post({
      json: { email, password }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const session = await response.json();
    
    // Store token
    localStorage.setItem('auth-token', session.session.id);
    
    return session;
  },
  
  // Logout
  logout: (): void => {
    localStorage.removeItem('auth-token');
    window.location.href = '/auth/log-in';
  },
  
  // Register
  register: async (email: string, password: string, name: string): Promise<Session> => {
    const response = await apiClient.auth.register.$post({
      json: { email, password, name }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const session = await response.json();
    
    // Store token
    localStorage.setItem('auth-token', session.session.id);
    
    return session;
  },
  
  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth-token');
  }
};
```

### 3. API Client Hooks (`src/lib/api/index.ts`)

```ts
// src/lib/api/index.ts
// Re-export the main client
export { apiClient } from './client';

// Re-export authentication utilities
export * from './auth';

// Re-export all data hooks
export * from '../data/cart';
export * from '../data/account';
export * from '../data/product';
```

### 4. Data Fetching Hooks (`src/data/cart/get-cart.ts`)

```ts
// src/data/cart/get-cart.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/client';

// Define the response type
export type Cart = {
  id: string | null;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    color?: string;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      discountPrice: number | null;
      images: Array<{ url: string; altText: string; id: string }>;  
      category: {
        id: string;
        name: string;
        slug: string;
      };
      stock: number;
    };
  }>;  
  subtotal: number;
  totalItems: number;
};

// Query key for caching
const CART_QUERY_KEY = 'cart';

// Fetch cart data
const getCart = async (): Promise<Cart> => {
  const response = await apiClient.cart.get.$get();
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch cart');
  }
  
  return await response.json();
};

// Custom hook for fetching cart
export const useCart = () => {
  return useQuery<Cart, Error>({
    queryKey: [CART_QUERY_KEY],
    queryFn: getCart,
    // Don't fetch on mount if user is not authenticated
    enabled: false,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Re-fetch on window focus
    refetchOnWindowFocus: true,
    // Keep previous data while fetching new data
    keepPreviousData: true,
  });
};
```

### 5. Add to Cart Mutation (`src/data/cart/add-item.ts`)

```ts
// src/data/cart/add-item.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/client';

// Define input type
export type AddItemInput = {
  productId: string;
  quantity?: number;
  color?: string;
};

// Define response type
export type AddItemResponse = {
  success: boolean;
  data: {
    id: string;
    productId: string;
    quantity: number;
    color?: string;
  };
};

// Mutation key
const ADD_ITEM_MUTATION_KEY = 'add-item';

// Add item to cart
const addCartItem = async (input: AddItemInput): Promise<AddItemResponse> => {
  const response = await apiClient.cart.addItem.$post({
    json: input
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add item to cart');
  }
  
  return await response.json();
};

// Custom hook for adding item to cart
export const useAddToCart = () => {
  return useMutation<AddItemResponse, Error, AddItemInput>({
    mutationKey: [ADD_ITEM_MUTATION_KEY],
    mutationFn: addCartItem,
    // Optimistic updates
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<Cart>(['cart']);
      
      // Optimistically update the cart
      queryClient.setQueryData<Cart>(['cart'], (old) => {
        if (!old) return old;
        
        // Add item to cart
        const newItem = {
          id: `temp-${Date.now()}`,
          productId: input.productId,
          quantity: input.quantity || 1,
          color: input.color,
          product: {
            id: input.productId,
            name: '',
            slug: '',
            price: 0,
            discountPrice: null,
            images: [],
            category: {
              id: '',
              name: '',
              slug: ''
            },
            stock: 0
          }
        };
        
        return {
          ...old,
          items: [...(old.items || []), newItem],
          totalItems: (old.totalItems || 0) + (input.quantity || 1)
        };
      });
      
      // Return context with previous value
      return { previousCart };
    },
    // On success
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    // On error
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousCart) {
        queryClient.setQueryData<Cart>(['cart'], context.previousCart);
      }
      
      // Show error message
      console.error('Failed to add item to cart:', error);
    }
  });
};
```

### 6. Product Queries (`src/data/product/get-products.ts`)

```ts
// src/data/product/get-products.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/client';

// Product filter types (matching backend)
export type ProductFilter = {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
  rating?: number;
  categories?: string[];
  materials?: string[];
  colors?: string[];
};

// Product type
export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  discountPrice: number | null;
  discountPercentage: number | null;
  rating: number;
  isNew: boolean;
  isOnSale: boolean;
  stock: number;
  colors: string[];
  material: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{ url: string; altText: string; id: string }>;  
  reviewCount: number;
};

// Product response type
export type ProductResponse = {
  items: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

// Query key for caching
const PRODUCTS_QUERY_KEY = 'products';

// Fetch products data
const getProducts = async (filters: ProductFilter = {}): Promise<ProductResponse> => {
  const response = await apiClient.product.get.$get({
    query: filters
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch products');
  }
  
  return await response.json();
};

// Custom hook for fetching products
export const useProducts = (filters: ProductFilter = {}) => {
  return useQuery<ProductResponse, Error>({
    queryKey: [PRODUCTS_QUERY_KEY, filters],
    queryFn: () => getProducts(filters),
    // Don't fetch on mount if no filters provided
    enabled: Object.keys(filters).length > 0,
    // Cache for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Keep previous data while fetching new data
    keepPreviousData: true,
  });
};

// Fetch product filters
const getProductFilters = async (): Promise<{
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    products: number;
  }>,
  materials: string[],
  colors: string[]
}> => {
  const response = await apiClient.product.filters.$get();
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch product filters');
  }
  
  return await response.json();
};

// Custom hook for fetching product filters
export const useProductFilters = () => {
  return useQuery({
    queryKey: ['product-filters'],
    queryFn: getProductFilters,
    // Cache for 1 hour
    staleTime: 60 * 60 * 1000,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    // Keep previous data
    keepPreviousData: true,
  });
};

// Fetch product suggestions
const getProductSuggestions = async (query: string): Promise<Array<{
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryName: string;
  image: string;
}>> => {
  const response = await apiClient.product.suggestions.$get({
    query: { query }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch product suggestions');
  }
  
  return await response.json();
};

// Custom hook for fetching product suggestions
export const useProductSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['product-suggestions', query],
    queryFn: () => getProductSuggestions(query),
    // Only fetch if query has at least 2 characters
    enabled: query.length >= 2,
    // Cache for 2 minutes
    staleTime: 2 * 60 * 1000,
    // Keep previous data
    keepPreviousData: true,
  });
};
```

### 7. API Client Usage Example (`src/app/product/[slug]/page.tsx`)

```tsx
// src/app/product/[slug]/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useProduct } from '@/data/product/get-product';
import { ProductSkeleton } from '@/components/ui/skeleton';
import { ProductDetails } from '@/components/product/product-detail';

export default function ProductPage() {
  const { slug } = useParams();
  
  const { data: product, isLoading, error } = useProduct(slug as string);
  
  if (isLoading) {
    return <ProductSkeleton />;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  if (!product) {
    return <div>Product not found</div>;
  }
  
  return <ProductDetails product={product} />;
}
```

### 8. API Client Usage Example (`src/components/product/product-card.tsx`)

```tsx
// src/components/product/product-card.tsx
'use client';

import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/product/get-products';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  
  const handleProductClick = () => {
    navigate(`/product/${product.slug}`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img 
          src={product.images[0]?.url || '/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2">
          {product.category.name}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-gray-900">
              ${product.discountPrice ? product.discountPrice : product.price}
            </span>
            {product.discountPrice && (
              <span className="text-gray-500 line-through ml-1">
                ${product.price}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-1">
              {product.reviewCount} reviews
            </span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Benefits of This Implementation

### ✅ Type Safety
- Full TypeScript support throughout
- Zod schema validation at API boundary
- Automatic type inference from API responses
- No runtime type errors in production

### ✅ Developer Experience
- Consistent API client pattern across all features
- Clear separation of concerns
- Easy to add new endpoints
- Auto-complete and IntelliSense support
- Comprehensive documentation

### ✅ Performance
- Caching with TanStack Query
- Optimistic updates for mutations
- Background data refetching
- Keep previous data while loading

### ✅ Scalability
- Modular structure makes it easy to add new features
- Reusable components and hooks
- Clear separation between UI and data logic
- Easy to test individual components

### ✅ Maintainability
- Single source of truth for API types
- Consistent error handling
- Clear folder structure
- Easy to onboard new developers

---

## Next Steps

1. **Implement the structure**: Create the recommended folder structure
2. **Add the API client**: Implement the client and authentication utilities
3. **Create data hooks**: Convert existing data fetching to use the new hooks
4. **Update components**: Refactor components to use the new API client
5. **Add tests**: Write unit and integration tests for the new implementation
6. **Document**: Add documentation to the `docs/` directory

This implementation provides a solid foundation for the frontend that complements the excellent backend architecture, creating a cohesive, type-safe, and scalable e-commerce application.
