// --- 1. Validators & Types ---

import type { Prisma } from "@ecomerceNextjs/db";

/**
 * Selector for the Wishlist Page.
 * We fetch just enough product info to display a card.
 */
export const wishItemSelect = {
    id: true,
    productId: true,
    createdAt: true,
    product: {
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            discountPrice: true,
            stock: true, // Important to show if out of stock in wishlist
            images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true, altText: true },
            },
            category: {
                select: { name: true, slug: true },
            },
        },
    },
} satisfies Prisma.WishSelect;
