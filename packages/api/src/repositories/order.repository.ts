import type { OrderStatus, PaymentStatus } from "@ecommerceNextjs/db";
import type { CreateOrderInput } from "@ecommerceNextjs/types";

export interface OrderRepository {
  findByUserId(userId: string): Promise<unknown>;
  findById(userId: string, orderId: string): Promise<unknown>;
  createFromCart(userId: string, input: CreateOrderInput): Promise<unknown>;
  updateStatus(orderId: string, status: OrderStatus): Promise<unknown>;
  updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<unknown>;
}