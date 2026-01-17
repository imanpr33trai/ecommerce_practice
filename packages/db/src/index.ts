import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv";

import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter, errorFormat: "pretty" });

export default prisma;

export * from "../prisma/generated/client";
