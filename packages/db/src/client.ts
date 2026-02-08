import { env } from "@ecomerceNextjs/env";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

// Use globalThis for broader environment compatibility
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Named export with global memoization
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
