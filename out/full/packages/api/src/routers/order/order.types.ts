// Import Enums from your DB package
import { OrderStatus, PaymentStatus } from "@ecomerceNextjs/db";
import { z } from "zod";

// 1. Create Order (Checkout)
export const CreateOrderSchema = z.object({
  addressId: z.string().min(1, "Shipping address is required"),
  paymentProvider: z.string().default("stripe"),
});

// 2. Update Status (Admin)
export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

// 3. Update Payment (Admin)
export const UpdatePaymentStatusSchema = z.object({
  status: z.nativeEnum(PaymentStatus),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
