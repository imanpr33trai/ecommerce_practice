import prisma, { OrderStatus, PaymentStatus } from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure, router } from "../..";

export const orderRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                discountPrice: true,
                images: { where: { isPrimary: true }, take: 1, select: { url: true, id: true, altText: true } },
              },
            },
          },
        },
        payment: {
          select: { id: true, amount: true, provider: true, status: true, transactionId: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
          discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
        },
      })),
      payment: order.payment.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
    }));
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const order = await prisma.order.findUnique({
      where: { id: input.id, userId },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                discountPrice: true,
                images: { where: { isPrimary: true }, take: 1, select: { url: true, id: true, altText: true } },
              },
            },
          },
        },
        payment: {
          select: { id: true, amount: true, provider: true, status: true, transactionId: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Order not Found" });
    }

    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
          discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
        },
      })),
      payment: order.payment.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
    };
  }),
  /**
   * Create Order from Current Cart
   * This is the heart of the checkout process.
   * Features: Transactional, Stock Check, Cart Clearing.
   */
  createFromCart: protectedProcedure
    .input(
      z.object({
        paymentProvider: z.string().min(1, "Payment provider is required"),
        addressId: z.string().min(1, "Shipping address is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { paymentProvider, addressId } = input;

      return prisma.$transaction(async (tx) => {
        // 1. Verify Address belongs to user
        const address = await tx.address.findUnique({
          where: { id: addressId },
        });

        if (!address || address.userId !== userId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid shipping address" });
        }

        // 2. Fetch Cart
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: { product: true },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // 3. Stock Check & Total Calculation
        for (const cartItem of cart.items) {
          if (cartItem.quantity > cartItem.product.stock) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Not enough stock for ${cartItem.product.name}`,
            });
          }

          const price = Number(cartItem.product.discountPrice ?? cartItem.product.price);
          totalAmount += price * cartItem.quantity;

          orderItemsData.push({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            // You might want to snapshot price here too in a real app
          });

          // Decrement Stock
          await tx.product.update({
            where: { id: cartItem.productId },
            data: { stock: { decrement: cartItem.quantity } },
          });
        }

        // 4. Create Order
        // Note: Ideally your Order schema has a 'shippingAddressId' field.
        // If not, you might store a snapshot. Assuming you have the relation:
        const order = await tx.order.create({
          data: {
            userId,
            totalAmount,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            // shippingAddressId: addressId, // Uncomment if you added this field to Schema
            items: { create: orderItemsData },
            payment: {
              create: {
                amount: totalAmount,
                provider: paymentProvider,
                status: PaymentStatus.PENDING,
              },
            },
          },
        });

        // 5. Clear Cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return order;
      });
    }),
  /**
   * Admin: Update Order Status
   * Usage: Admin Dashboard (Set to SHIPPED, DELIVERED, CANCELLED)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(OrderStatus),
      }),
    )
    .mutation(async ({ input }) => {
      // TODO: Add ADMIN ROLE CHECK: if (ctx.session.user.role !== 'ADMIN') throw new TRPCError({ code: 'FORBIDDEN' });
      return prisma.order.update({
        where: { id: input.orderId },
        data: { status: input.status, updatedAt: new Date() },
      });
    }),

  /**
   * Admin: Update Payment Status
   * Usage: Admin Dashboard (Set to PAID, REFUNDED)
   */
  updatePaymentStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(PaymentStatus),
      }),
    )
    .mutation(async ({ input }) => {
      // TODO: Add ADMIN ROLE CHECK
      return prisma.order.update({
        where: { id: input.orderId },
        data: { paymentStatus: input.status, updatedAt: new Date() },
      });
    }),
});
