import z from "zod";

export const ProductFilterSchema = z.object({
    categories: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),

    minPrice: z.number().default(0),
    maxPrice: z.number().default(10000),

    onSale: z.boolean().default(false),
    inStock: z.boolean().default(false),
    search: z.string().optional(),

    rating: z.number().nullable().optional(),

    sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});



// const productListSelect = Prisma.validator<Prisma.ProductSelect>()({
//   id: true,
//   name: true,
//   slug: true,
//   price: true,
//   discountPrice: true,
//   stock: true,
//   createdAt: true, // Needed for 'New' badge logic
//   // Relations:
//   category: {
//     select: { name: true, slug: true },
//   },
//   images: {
//     where: { isPrimary: true },
//     take: 1,
//     select: { url: true, altText: true },
//   },
//   _count: {
//     select: { reviews: true },
//   },
// });

// /**
//  * Detail Selector:
//  * Fetches everything needed for the PDP (Product Detail Page).
//  */
// const productDetailInclude = Prisma.validator<Prisma.ProductInclude>()({
//   category: true,
//   images: true, // Fetch all images
//   reviews: {
//     take: 5,
//     orderBy: { createdAt: "desc" },
//     select: {
//       rating: true,
//       comment: true,
//       user: { select: { name: true } },
//     },
//   },
// });
