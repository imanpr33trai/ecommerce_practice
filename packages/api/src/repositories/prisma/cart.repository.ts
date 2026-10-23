import { prisma } from "@ecommerceNextjs/db";
import type { Prisma } from "@ecommerceNextjs/db";
import type { AddItemInput } from "@ecommerceNextjs/types";
import type { CartRepository } from "../cart.repository";

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
      category: { select: { id: true, name: true, slug: true } },
      discountPrice: true,
      stock: true,
      colors: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true, altText: true, id: true } },
    },
  },
} satisfies Prisma.CartItemSelect;

export class PrismaCartRepository implements CartRepository {
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          select: cartItemSelect,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async addItem(userId: string, input: AddItemInput) {
    const { productId, quantity, color } = input;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, isActive: true, name: true, colors: true },
    });

    if (!product || !product.isActive) {
      throw new Error("Product not available");
    }

    if (color && (!product.colors || !product.colors.includes(color))) {
      throw new Error(`Color '${color}' is not available for this product`);
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const whereClause: Prisma.CartItemWhereInput = {
      cartId: cart.id,
      productId,
    };
    if (color) {
      whereClause.color = color;
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: whereClause,
    });

    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > product.stock) {
      throw new Error(`Cannot add. Only ${product.stock} items in stock.`);
    }

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    } else {
      const createData = {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: productId } },
        quantity,
        ...(color ? { color } : {}),
      };
      return prisma.cartItem.create({
        data: createData as Prisma.CartItemCreateInput,
        include: { product: true },
      });
    }
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: { select: { stock: true, isActive: true } },
      },
    });

    if (!item || item.cart.userId !== userId) {
      throw new Error("Item not found or access denied");
    }

    if (quantity > item.product.stock) {
      throw new Error(`Cannot update. Only ${item.product.stock} items in stock.`);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      select: { cart: { select: { userId: true } } },
    });

    if (!item || item.cart.userId !== userId) {
      throw new Error("Item not found or access denied");
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}