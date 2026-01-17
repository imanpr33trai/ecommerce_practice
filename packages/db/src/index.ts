import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../prisma/generated/client";

console.log("DATABASE_URL:", Bun.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: Bun.env.DATABASE_URL ,
});
const prisma = new PrismaClient({ adapter, errorFormat: "pretty" });

export default prisma;

export * from "../prisma/generated/client";
