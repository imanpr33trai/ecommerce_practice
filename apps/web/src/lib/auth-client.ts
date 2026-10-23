import { env } from "@ecommerceNextjs/env/web";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@ecommerceNextjs/auth";
import "dotenv/config";

// Create the auth client with full type inference from the auth package
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

// Export all auth client methods with proper types
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Type-safe session hook with proper typing
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// Re-export auth type for consumers
export type { auth } from "@ecommerceNextjs/auth";

// Export typed auth client for direct usage
export { authClient as default };

// Helper function to get current session (server-side)
export async function getCurrentSession() {
  return await authClient.getSession();
}

// Helper function to check if user is authenticated
export function isAuthenticated(user: User | null | undefined): user is User {
  return user !== null && user !== undefined;
}