import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define where your Hono server lives
// In production, this should be your actual backend domain
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // --- LOGIC: Proxy Logic ---

  // 1. Construct the target URL (pointing to Hono)
  // Example: http://localhost:3000/api/auth/session -> http://localhost:3001/api/auth/session
  const targetUrl = new URL(pathname + search, BACKEND_URL);

  // 2. Forward Headers
  // We create a new Headers object based on the incoming request to ensure
  // Better Auth receives the Cookies and Host correctly.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-forwarded-host", request.headers.get("host") || "");
  requestHeaders.set("x-forwarded-proto", request.nextUrl.protocol);

  // 3. Rewrite the Request
  // NextResponse.rewrite fetches the data from the backend but keeps
  // the browser URL showing localhost:3000. This avoids CORS.
  return NextResponse.rewrite(targetUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}

// --- CONFIGURATION: Matcher ---
// Only run this middleware on specific paths to save performance.
export const config = {
  matcher: [
    // 1. Better Auth Routes
    "/api/auth/:path*",

    // 2. tRPC Routes (Client Side)
    "/trpc/:path*",

    // 3. Optional: Any other backend routes
    // "/api/:path*",
  ],
};
