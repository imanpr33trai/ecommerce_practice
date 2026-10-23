import { z } from "zod";

// OrderStatus enum values (from Prisma schema)
export const OrderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export type OrderStatus = z.infer<typeof OrderStatusEnum>;

// PaymentStatus enum values (from Prisma schema)
export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

// 1. Create Order (Checkout)
export const CreateOrderSchema = z.object({
  addressId: z.string().min(1, "Shipping address is required"),
  paymentProvider: z.string().default("stripe"),
});

// 2. Update Status (Admin)
export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
});

// 3. Update Payment (Admin)
export const UpdatePaymentStatusSchema = z.object({
  status: PaymentStatusEnum,
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof UpdatePaymentStatusSchema>;