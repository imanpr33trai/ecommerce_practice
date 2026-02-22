import type { Session } from "@ecomerceNextjs/auth"; // Your auth package
import type { PrismaClient } from "@ecomerceNextjs/db";

// Define the Hono Environment Type
export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
    prisma: PrismaClient;
  };
};
