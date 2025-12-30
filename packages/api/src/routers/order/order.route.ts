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
        // You might add address IDs, shipping options here later
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { paymentProvider } = input;

      return prisma.$transaction(async (tx) => {
        // 1. Fetch User's Cart
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: { select: { id: true, name: true, stock: true, price: true, discountPrice: true } },
              },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // 2. Validate Stock and Calculate Total
        for (const cartItem of cart.items) {
          const product = cartItem.product;
          const price = Number(product.discountPrice ?? product.price);

          if (cartItem.quantity > product.stock) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`,
            });
          }

          totalAmount += price * cartItem.quantity;

          orderItemsData.push({
            productId: product.id,
            quantity: cartItem.quantity,
          });

          // 3. Decrement Product Stock
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: cartItem.quantity } },
          });
        }

        // 4. Create the Order
        const order = await tx.order.create({
          data: {
            userId,
            totalAmount,
            status: OrderStatus.PENDING, // Always PENDING initially
            paymentStatus: PaymentStatus.PENDING,
            items: {
              create: orderItemsData,
            },
            payment: {
              create: {
                amount: totalAmount,
                provider: paymentProvider,
                status: PaymentStatus.PENDING,
                // transactionId: '...', // This would come from external payment gateway
              },
            },
          },
          select: { id: true, totalAmount: true, status: true, paymentStatus: true }, // Return basic order info
        });

        // 5. Clear the User's Cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        // 6. Return the newly created order
        return {
          ...order,
          totalAmount: Number(order.totalAmount),
        };
      });
    }) /**
   * Admin: Update Order Status
   * Usage: Admin Dashboard (Set to SHIPPED, DELIVERED, CANCELLED)
   */,
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
