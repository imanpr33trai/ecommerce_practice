import { env } from "@ecomerceNextjs/env/server";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

import { PrismaClient } from "../prisma/generated/client";

dotenv.config({ path: "../.env", debug: true });

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
