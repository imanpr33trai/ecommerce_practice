// packages/api/src/routers/user.ts

import prisma, { OrderStatus, Prisma } from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../../index";

export const userRouter = router({
  /**
   * Get current authenticated user
   * Protected - requires authentication
   */
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    return {
      id: ctx.session.user.id,
      email: ctx.session.user.email,
      name: ctx.session.user.name,
      image: ctx.session.user.image,
      emailVerified: ctx.session.user.emailVerified,
      createdAt: ctx.session.user.createdAt,
      updatedAt: ctx.session.user.updatedAt,
    };
  }),

  /**
   * Get user profile by ID
   * Public - anyone can view user profiles
   */
  getById: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    // Add your database query here
    // For now, returning session user if IDs match
    if (ctx.session?.user?.id === input.userId) {
      return {
        id: ctx.session.user.id,
        name: ctx.session.user.name,
        email: ctx.session.user.email,
        image: ctx.session.user.image,
      };
    }

    // Query your database for the user
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }),

  /**
   * Update user profile
   * Protected - only authenticated users can update their profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Add your database update logic here
      // Example: await db.user.update({ where: { id: userId }, data: input })

      return {
        success: true,
        user: {
          id: userId,
          ...input,
        },
      };
    }),

  /**
   * Delete user account
   * Protected - users can delete their own account
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Add your database delete logic here
    // Example: await db.user.delete({ where: { id: userId } })

    return {
      success: true,
      message: "Account deleted successfully",
    };
  }),

  /**
   * Get user preferences
   * Protected
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Query preferences from database
    // Example: const prefs = await db.userPreferences.findUnique({ where: { userId } })

    return {
      theme: "light",
      emailNotifications: true,
      marketingEmails: false,
      language: "en",
    };
  }),

  /**
   * Update user preferences
   * Protected
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        emailNotifications: z.boolean().optional(),
        marketingEmails: z.boolean().optional(),
        language: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Update preferences in database
      // Example: await db.userPreferences.upsert({
      //   where: { userId },
      //   update: input,
      //   create: { userId, ...input }
      // })

      return {
        success: true,
        preferences: input,
      };
    }),

  /**
   * Get user's order history
   * Protected
   */
  getOrderHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          cursor: z.string().optional(),
          // status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
          status: z.enum(OrderStatus),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const limit = input?.limit ?? 10;

      // Query orders from database
      // Example:
      // const orders = await prisma.order.findMany({
      //   where: { userId, status: input?.status },
      //   take: limit + 1,
      //   cursor: input?.cursor ? { id: input.cursor } : undefined,
      //   orderBy: { createdAt: "desc" },
      // });

      // Mock data for now
      const orders = [];
      const hasNextPage = orders.length > limit;
      const items = hasNextPage ? orders.slice(0, -1) : orders;

      return {
        items,
        nextCursor: hasNextPage ? items[items.length - 1]?.id : undefined,
      };
    }),

  /**
   * Get user's wishlist
   * Protected
   */
  getWishlist: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Query wishlist from database
    // const wishlist = await db.wishlist.findMany({
    //   where: { userId },
    //   include: { product: true }
    // })

    return {
      items: [],
      count: 0,
    };
  }),

  /**
   * Add item to wishlist
   * Protected
   */
  addToWishlist: protectedProcedure.input(z.object({ productId: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;

    // Add to wishlist
    // await db.wishlist.create({
    //   data: { userId, productId: input.productId }
    // })

    return {
      success: true,
      message: "Added to wishlist",
    };
  }),

  /**
   * Remove item from wishlist
   * Protected
   */
  removeFromWishlist: protectedProcedure.input(z.object({ productId: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;

    // Remove from wishlist
    // await db.wishlist.delete({
    //   where: { userId_productId: { userId, productId: input.productId } }
    // })

    return {
      success: true,
      message: "Removed from wishlist",
    };
  }),

  /**
   * Get user's addresses
   * Protected
   */
  getAddresses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Query addresses from database
    // const addresses = await db.address.findMany({ where: { userId } })

    return [];
  }),

  /**
   * Add new address
   * Protected
   */
  addAddress: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zipCode: z.string().min(1),
        country: z.string().min(1),
        phone: z.string().min(1),
        isDefault: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Add address to database
      // const address = await db.address.create({
      //   data: { ...input, userId }
      // })

      return {
        success: true,
        address: { id: "new-address-id", ...input },
      };
    }),

  /**
   * Update address
   * Protected
   */
  updateAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.string(),
        name: z.string().min(1).optional(),
        street: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        zipCode: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        phone: z.string().min(1).optional(),
        isDefault: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { addressId, ...data } = input;

      // Update address in database
      // await db.address.update({
      //   where: { id: addressId, userId },
      //   data
      // })

      return {
        success: true,
        message: "Address updated",
      };
    }),

  /**
   * Delete address
   * Protected
   */
  deleteAddress: protectedProcedure.input(z.object({ addressId: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;

    // Delete address from database
    // await db.address.delete({
    //   where: { id: input.addressId, userId }
    // })

    return {
      success: true,
      message: "Address deleted",
    };
  }),

  /**
   * Check if email is available
   * Public - used during registration
   */
  checkEmailAvailable: publicProcedure.input(z.object({ email: z.string().email() })).query(async ({ input }) => {
    // Check if email exists in database
    // const exists = await db.user.findUnique({ where: { email: input.email } })

    return {
      available: true, // !exists
    };
  }),
});
