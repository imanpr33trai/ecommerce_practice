import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
});
const prisma = new PrismaClient({ adapter, errorFormat: "pretty" });

export default prisma;

export {
  OrderStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "../prisma/generated/client";
