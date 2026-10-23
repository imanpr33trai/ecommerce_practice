import { AppError } from "@ecommerceNextjs/types";
import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
  OrderStatus,
  PaymentStatus,
} from "@ecommerceNextjs/types";

import type { OrderRepository } from "../repositories/order.repository";
import type { CartRepository } from "../repositories/cart.repository";
import type { AddressRepository } from "../repositories/address.repository";
import type { ProductRepository } from "../repositories/product.repository";

/**
 * OrderService handles order-related business logic.
 * Depends on OrderRepository, CartRepository, AddressRepository, and ProductRepository interfaces.
 * No Prisma or Hono imports in service layer.
 */
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly addressRepository: AddressRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * List user's orders
   */
  async listByUser(userId: string) {
    return this.orderRepository.findByUserId(userId);
  }

  /**
   * Get single order by ID
   * @throws AppError with NOT_FOUND if order doesn't exist
   * @throws AppError with FORBIDDEN if unauthorized access
   */
  async getById(userId: string, orderId: string) {
    const order = await this.orderRepository.findById(userId, orderId);

    if (!order) {
      throw AppError.notFound("Order", orderId);
    }

    return order;
  }

  /**
   * Create order from cart (checkout)
   * @throws AppError with NOT_FOUND if address not found
   * @throws AppError with VALIDATION_ERROR if cart is empty
   * @throws AppError with OUT_OF_STOCK if insufficient stock
   */
  async createFromCart(userId: string, input: CreateOrderInput) {
    const { addressId, paymentProvider } = input;

    // Verify address belongs to user
    const addresses = await this.addressRepository.findByUserId(userId);
    const address = Array.isArray(addresses) 
      ? addresses.find((a: any) => a.id === addressId)
      : null;
    
    if (!address) {
      throw AppError.notFound("Address", addressId);
    }

    // Check cart has items
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || (cart as any).items?.length === 0) {
      throw AppError.validation("Cart is empty");
    }

    return this.orderRepository.createFromCart(userId, input);
  }

  /**
   * Update order status (admin)
   */
  async updateStatus(orderId: string, status: OrderStatus) {
    return this.orderRepository.updateStatus(orderId, status);
  }

  /**
   * Update payment status (admin)
   */
  async updatePaymentStatus(orderId: string, status: PaymentStatus) {
    return this.orderRepository.updatePaymentStatus(orderId, status);
  }
}