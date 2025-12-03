import { publicProcedure, router } from "@/lib/trpc";
import prisma from "../../prisma";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@generated/client";
import { getDescendantCategoryIds } from "@/utils/category-utils";

type ProdduuctWithCategoryAndReviewCount = Prisma.ProductGetPayload<{
    include: {
        images: { where: { isPrimary: true }; take: 1 },
        category: true,
        _count: { select: { reviews: true } }
    }
}>

type CategoryWithParent = Prisma.CategoryGetPayload<{
    select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        parent: {
            select: {
                id: true,
                slug: true
            }
        }
    }
}>
type ProductForList = Prisma.ProductGetPayload<{
    include: {
        images: { where: { isPrimary: true }; take: 1 };
        category: true;
        _count: { select: { reviews: true } }
    }
}>

export const productRouter = router({
    getNewDeal: publicProcedure.query(async () => {
        return await prisma.product.findFirst({
            where: {
                tags: {
                    has: "newDeal"
                }
            },
            include: {
                reviews: {
                    select: {
                        rating: true,
                    }
                },

                category: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        altText: true,
                        url: true

                    }
                }
            }
        })
    }),
    getExclusiveDeal: publicProcedure.query(async () => {
        return await prisma.product.findFirst({
            where:
            {
                tags: { has: "exclusive" }
            },
            include: {
                reviews: {
                    select: {
                        rating: true,
                    }
                },

                category: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        altText: true,
                        url: true

                    }
                }
            }
        })
    }),
    getGreatValueDeal: publicProcedure.query(async () => {
        return await prisma.product.findFirst({
            where:
            {
                tags: { has: "GreatValueDeal" }
            },
            include: {
                reviews: {
                    select: {
                        rating: true,
                    }
                },

                category: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        altText: true,
                        url: true

                    }
                }
            }
        })
    }),
    getAll: publicProcedure.query(async () => {
        return await prisma.product.findMany({
            include: {
                images: true,
                category: true,
                reviews: true
            }
        })
    }),
    getProductBySlug: publicProcedure.input(z.object({
        slug: z.string().min(1, { message: "Slug cannot be empty" }),

    })).query(async ({ input }) => {
        const product = await prisma.product.findUnique({
            where: { slug: input.slug }
            , include: {
                images: true,
                category: true,
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        user: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                },
            }
        })
        if (!product) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `No product found with slug ${input.slug}`,
            });

        }
        return product;
    }),
    getByCategorySlug: publicProcedure.input(z.object({
        slug: z.array(z.string()).min(1, { message: "Slug array cannot be empty" }),
    })).query(async ({ input }) => {
        const finalCategorySlug = input.slug[input.slug.length - 1];

        const category = await prisma.category.findFirst({
            where: { slug: finalCategorySlug },
            include: {
                products: {
                    include: {
                        images: true,
                        category: true,
                        _count: { select: { reviews: true } },
                    }
                }
            }
        })
        if (!category) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `No category found with slug:${input.slug.join('/')} `
            })
        }
        return category.products;
    }),
    getByCategoryHierarchy: publicProcedure.input(z.object({
        slugs: z.array(z.string()).min(1, { message: "Slug array cannot be empty" }),
    })).query(async ({ input }) => {
        const slugs = input.slugs;
        const finalCategorySlug = slugs[slugs.length - 1];

        const targetCategory: CategoryWithParent | null = await prisma.category.findUnique({
            where: { slug: finalCategorySlug },
            select: {
                id: true,
                name: true,
                slug: true,
                parentId: true,
                parent: {
                    select: {
                        slug: true,
                        id: true
                    }
                }
            }
        });
        if (!targetCategory) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Category with slug ${finalCategorySlug} not found.`
            })
        }
        if (slugs.length > 1) {
            let currentCategory: CategoryWithParent | null = targetCategory;
            for (let i = slugs.length - 2; i >= 0; i--) {
                const expectedSlug = slugs[i];
                if (!currentCategory?.parent || currentCategory.parent.slug !== expectedSlug) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `Category hierarchy mismatch. ${finalCategorySlug} is not under ${expectedSlug}.`
                    })
                }
                currentCategory = await prisma.category.findUnique({
                    where: { id: currentCategory?.parent.id },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        parentId: true,
                        parent: {
                            select: {
                                slug: true, id: true
                            }
                        }
                    }
                })
                if (!currentCategory && i > 0) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `Category hierarchy broken. Intermediate parent for ${expectedSlug} not found.`,
                    })
                }
            }
        }

        const categoryIdsToFetch = await getDescendantCategoryIds(targetCategory.id, prisma);
        console.log(`[DEBUG] Fetching products for category IDs: ${categoryIdsToFetch.join(', ')}`);

        const products: ProdduuctWithCategoryAndReviewCount[] = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryIdsToFetch
                }
            },
            include: {
                images: { where: { isPrimary: true }, take: 1 },
                category: true,
                _count: { select: { reviews: true } },
            },
            orderBy: { createdAt: "desc" }
        })
        return products;
    }),
    getRelatedProducts: publicProcedure.input(z.object({
        categoryId: z.string().cuid().optional(),
        tags: z.array(z.string()).optional(),
        excludeProductId: z.string().cuid(),
        limit: z.number().min(1).max(10).default(3)
    })).query(async ({ input }) => {
        const { categoryId, tags, excludeProductId, limit } = input

        const whereClause: Prisma.ProductWhereInput = {
            id: { not: excludeProductId },
            isActive: true,
            OR: [],
        }
        if (categoryId) {
            whereClause.OR?.push({
                categoryId: categoryId
            })
        }
        if (tags && tags.length > 0) {
            whereClause.OR?.push({
                tags: { hasSome: tags }
            })
        }

        if (whereClause.OR?.length === 0) {
            delete whereClause.OR;
        }

        const relatedProducts: ProductForList[] = await prisma.product.findMany({
            where: whereClause,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                images: true,
                category: true,
                _count: { select: { reviews: true } },
            },
        });
        return relatedProducts;
    })
})