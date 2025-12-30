import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

import { PrismaClient } from "../prisma/generated/client";

dotenv.config({
  path: "../../.env",
  debug: true,
});
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:12345@localhost:5432/ecommerce",
});
const prisma = new PrismaClient({ adapter, errorFormat: "pretty" });

export default prisma;

export { $Enums, AddressType, OrderStatus, PaymentStatus, Prisma, PrismaClient, UserRole } from "../prisma/generated/client";
