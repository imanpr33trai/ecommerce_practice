import prisma, { OrderStatus, PaymentStatus, type Prisma } from "@ecomerceNextjs/db";

import type { CreateOrderInput } from "./order.types";

// --- Helpers ---

// Selector to get full order details
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
  payment: {
    orderBy: { createdAt: "desc" },
    take: 1,
  },
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude;

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

type TransformedOrder = Omit<OrderWithDetails, "totalAmount" | "items" | "payment"> & {
  totalAmount: number;
  items: Array<
    Omit<OrderWithDetails["items"][number], "product"> & {
      product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discountPrice: number | null;
        image: string;
      };
    }
  >;
  payment: Array<
    OrderWithDetails["payment"][number] & {
      amount: number;
    }
  >;
};

// Transform Decimal to Number for JSON response
const transformOrder = (order: OrderWithDetails): TransformedOrder => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  items: order.items.map((item: any) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
      discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
      image: item.product.images[0]?.url || "/placeholder.jpg",
    },
  })),
  payment: order.payment.map((p: any) => ({
    ...p,
    amount: Number(p.amount),
  })),
});

export const orderQueries = {
  /**
   * List User Orders
   */
  listByUser: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
    return orders.map(transformOrder);
  },

  /**
   * Get Single Order
   */
  getById: async (userId: string, orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      return null;
    }
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to order");
    }

    return transformOrder(order);
  },

  /**
   * Create Order (Checkout Transaction)
   */
  createFromCart: async (userId: string, input: CreateOrderInput) => {
    const { addressId, paymentProvider } = input;

    return prisma.$transaction(async (tx) => {
      // 1. Verify Address
      const address = await tx.address.findUnique({ where: { id: addressId } });
      if (!address || address.userId !== userId) {
        throw new Error("Invalid shipping address");
      }

      // 2. Fetch Cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: { include: { product: true } },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // 3. Validate Stock & Calculate Total
      let totalAmount = 0;
      const orderItemsData = [];

      for (const cartItem of cart.items) {
        // Stock Check
        if (cartItem.quantity > cartItem.product.stock) {
          throw new Error(`Not enough stock for ${cartItem.product.name}`);
        }

        const price = Number(cartItem.product.discountPrice ?? cartItem.product.price);
        totalAmount += price * cartItem.quantity;

        orderItemsData.push({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        });

        // Decrement Stock
        await tx.product.update({
          where: { id: cartItem.productId },
          data: { stock: { decrement: cartItem.quantity } },
        });
      }

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          // shippingAddressId: addressId, // Uncomment if schema supports it
          items: { create: orderItemsData },
          payment: {
            create: {
              amount: totalAmount,
              provider: paymentProvider,
              status: PaymentStatus.PENDING,
            },
          },
        },
        include: { items: true }, // Return basic info
      });

      // 5. Clear Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { ...order, totalAmount: Number(order.totalAmount) };
    });
  },

  /**
   * Update Status (Admin)
   */
  updateStatus: async (orderId: string, status: OrderStatus) => {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  },

  /**
   * Update Payment Status (Admin)
   */
  updatePaymentStatus: async (orderId: string, status: PaymentStatus) => {
    return prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });
  },
};
