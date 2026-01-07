import { auth, type Session } from "@ecomerceNextjs/auth"; // Your Better Auth instance
import type { Context as HonoContext } from "hono";

// 1. Simplify type inference using Better Auth's built-in $Infer

export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
  };
};

export type CreateContextOptions = {
  session: Session | null;
  headers: Headers;
  hono?: HonoContext<any>; // Optional for Next.js compatibility
};

export async function createContext(
  // Accepts either Hono Context OR a standard Request
  args: HonoContext<any> | { req: Request },
): Promise<CreateContextOptions> {
  // 1. Identify if we are in Hono or a raw Request (Next.js)
  const isHono = "get" in args;
  const requestHeaders = isHono ? args.req.raw.headers : args.req.headers;

  // 2. Resolve Session
  // If Hono: check its internal variables first. If Next.js: fetch from Better Auth.
  const session =
    isHono && args.get("session")
      ? { user: args.get("user"), session: args.get("session") }
      : await auth.api.getSession({ headers: requestHeaders });

  return {
    session,
    headers: requestHeaders,
    hono: isHono ? args : undefined,
  };
}

// Ensure this matches the tRPC requirement of Record<string, unknown>
export type Context = Awaited<ReturnType<typeof createContext>>;
