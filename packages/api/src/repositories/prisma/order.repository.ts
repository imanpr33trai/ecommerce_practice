import { OrderStatus, PaymentStatus, type Prisma, prisma } from "@ecommerceNextjs/db";
import type { CreateOrderInput } from "@ecommerceNextjs/types";

import type { OrderRepository } from "../order.repository";

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      },
    },
  },
  payment: { orderBy: { createdAt: "desc" }, take: 1 },
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

export class PrismaOrderRepository implements OrderRepository {
  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order || order.userId !== userId) {
      return null;
    }

    return order;
  }

  async createFromCart(userId: string, input: CreateOrderInput) {
    const { addressId, paymentProvider } = input;

    return prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({ where: { id: addressId } });
      if (!address || address.userId !== userId) {
        throw new Error("Invalid shipping address");
      }

      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let totalAmount = 0;
      const orderItemsData = [];

      for (const cartItem of cart.items) {
        if (cartItem.quantity > cartItem.product.stock) {
          throw new Error(`Not enough stock for ${cartItem.product.name}`);
        }

        const price = Number(cartItem.product.discountPrice ?? cartItem.product.price);
        totalAmount += price * cartItem.quantity;

        orderItemsData.push({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        });

        await tx.product.update({
          where: { id: cartItem.productId },
          data: { stock: { decrement: cartItem.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          items: { create: orderItemsData },
          payment: {
            create: {
              amount: totalAmount,
              provider: paymentProvider,
              status: PaymentStatus.PENDING,
            },
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { ...order, totalAmount: Number(order.totalAmount) };
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async updatePaymentStatus(orderId: string, status: PaymentStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });
  }
}
