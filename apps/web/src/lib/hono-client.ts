import { env } from "@ecommerceNextjs/env/web";
import { type ClientResponse, hc } from "hono/client";
import type { AppType } from "@ecommerceNextjs/api";

// Create the Hono client with full type inference from the API package
export const client = hc<AppType>(`${env.NEXT_PUBLIC_API_URL}/api`, {
  init: {
    credentials: "include",
  },
});

// Type-safe RPC caller with proper error handling
export const callRpc = async <T>(
  rpc: Promise<ClientResponse<T>>,
): Promise<{ data: T; error: null } | { data: null; error: string }> => {
  try {
    const response = await rpc;

    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: errorText };
    }
    const data = await response.json();
    return { data: data as T, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};

// Export individual route clients for direct usage
export const cartClient = client.cart;
export const productClient = client.product;
export const wishClient = client.wish;
export const userClient = client.user;
export const orderClient = client.order;
export const reviewClient = client.review;
export const addressClient = client.address;

// Re-export AppType for consumers
export type { AppType } from "@ecommerceNextjs/api";