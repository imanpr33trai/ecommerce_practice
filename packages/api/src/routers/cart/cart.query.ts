import prisma, { type Prisma } from "@ecomerceNextjs/db";

import type { AddItemInput } from "./cart.type";

// Selector to get product details inside cart items
const cartItemSelect = {
  id: true,
  quantity: true,
  color: true,
  productId: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      discountPrice: true,
      stock: true,
      colors: true,
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true, altText: true, id: true },
      },
    },
  },
} satisfies Prisma.CartItemSelect;

export const cartQueries = {
  /**
   * Get Cart with Calculated Totals
   */
  getCart: async (userId: string) => {
    // 1. Fetch Cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          select: cartItemSelect,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      return null;
    }

    // 2. Calculate Totals (Server Side Source of Truth)
    let subtotal = 0;
    let totalItems = 0;

    const items = cart.items.map((item) => {
      const price = Number(item.product.discountPrice ?? item.product.price);
      const lineTotal = price * item.quantity;

      subtotal += lineTotal;
      totalItems += item.quantity;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        // Helper flag for frontend UI
        isOutOfStock: item.quantity > item.product.stock,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          category: item.product.category,
          price: Number(item.product.price),
          discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
          images: item.product.images || [],
          stock: item.product.stock,
        },
      };
    });

    return {
      id: cart.id,
      items,
      subtotal,
      totalItems,
    };
  },

  /**
   * Add Item to Cart (Smart Upsert)
   */
  addItem: async (userId: string, input: AddItemInput) => {
    const { productId, quantity, color } = input;

    // A. Validate Product & Stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, isActive: true, name: true, colors: true },
    });

    if (!product || !product.isActive) {
      throw new Error("Product not available");
    }

    // B. Validate Color (if provided)
    if (color && (!product.colors || !product.colors.includes(color))) {
      throw new Error(`Color '${color}' is not available for this product`);
    }

    // C. Find or Create Cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // D. Check Existing Item (Same Product + Same Color)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
        // Prisma treats undefined as "ignore this filter", so we explicitly check for null if color is undefined
        color: color,
      },
    });

    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + quantity;

    // E. Stock Check
    if (newQty > product.stock) {
      throw new Error(`Cannot add. Only ${product.stock} items in stock.`);
    }

    // F. Upsert Logic
    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
          color: color,
        },
      });
    }
  } /**
   * Update Item Quantity
   * Logic: Strict Set (not increment) + Stock Check
   */,
  updateQuantity: async (userId: string, itemId: string, quantity: number) => {
    // 1. Fetch Item + Product Stock + Cart Ownership
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true, // Needed to verify userId
        product: { select: { stock: true, isActive: true } },
      },
    });

    // 2. Security Check: Does item exist and belong to user?
    if (!item || item.cart.userId !== userId) {
      throw new Error("Item not found or access denied");
    }

    // 3. Stock Check
    if (quantity > item.product.stock) {
      throw new Error(`Cannot update. Only ${item.product.stock} items in stock.`);
    }

    // 4. Update
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  /**
   * Remove Single Item
   */
  removeItem: async (userId: string, itemId: string) => {
    // 1. Security Check (Optimized)
    // We try to delete only if the related cart belongs to the user
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      select: { cart: { select: { userId: true } } },
    });

    if (!item || item.cart.userId !== userId) {
      throw new Error("Item not found or access denied");
    }

    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  },

  /**
   * Clear All Items
   */
  clearCart: async (userId: string) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      return; // Nothing to clear
    }

    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  },
};
