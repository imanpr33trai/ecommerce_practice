import type { Prisma } from "@ecomerceNextjs/db";

export const cartItemInclude = {
    product: {
        include: {
            CartItem: true
        }
    }
} satisfies Prisma.CartItemInclude;
