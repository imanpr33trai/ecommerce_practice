import prisma, { type Prisma } from "@ecomerceNextjs/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import z4 from "zod/v4";
import { protectedProcedure, publicProcedure, router } from "../index.js";
import { productDetailInclude, productListSelect } from "../types/index.js";
import { slugify } from "../utils/slugify.js"; // Assume you created the helper above

// Input Schema for Creating a Product
const createProductSchema = z.object({
	name: z.string().min(3),
	description: z.string().optional(),
	price: z.number().min(0), // Input as number, convert to Decimal later
	discountPrice: z.number().optional(),
	stock: z.number().int().default(0),
	sku: z.string().optional(),
	categoryId: z.string().optional(),
	tags: z.array(z.string()).default([]),
	isActive: z.boolean().default(true),
	images: z
		.array(
			z.object({
				url: z.string().url(),
				altText: z.string().optional(),
				isPrimary: z.boolean().default(false),
			}),
		)
		.optional(),
});

export const productRouter = router({
	// CREATE PRODUCT (Admin)
	create: protectedProcedure
		.input(createProductSchema)
		.mutation(async ({ ctx, input }) => {
			// TODO: Check if ctx.user.role === 'ADMIN'

			const slug = slugify(input.name);

			// Ensure slug uniqueness (simple check)
			const existing = await prisma.product.findUnique({ where: { slug } });
			if (existing) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Product with this name already exists",
				});
			}

			return prisma.product.create({
				data: {
					name: input.name,
					slug: slug,
					description: input.description,
					price: input.price, // Prisma accepts number for Decimal fields automatically
					discountPrice: input.discountPrice,
					stock: input.stock,
					sku: input.sku,
					isActive: input.isActive,
					tags: input.tags,
					categoryId: input.categoryId,
					// Nested write: Create images at the same time
					images: {
						create: input.images?.map((img) => ({
							url: img.url,
							altText: img.altText,
							isPrimary: img.isPrimary,
						})),
					},
				},
			});
		}),

	// UPDATE PRODUCT (Admin)
	update: protectedProcedure
		.input(createProductSchema.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// TODO: Check Admin Role
			const { id, images, ...data } = input;

			// Logic: If images are provided, we might want to wipe old ones and add new ones,
			// or handling image updates is complex. Here is a simple "Append" strategy.

			return prisma.product.update({
				where: { id },
				data: {
					...data,
					// Only update slug if name changed
					slug: data.name ? slugify(data.name) : undefined,
					updatedAt: new Date(),
				},
			});
		}),

	// DELETE PRODUCT (Admin)
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// TODO: Check Admin Role
			return prisma.product.delete({
				where: { id: input.id },
			});
		}),

	// ADD IMAGE TO PRODUCT
	addImage: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
				url: z.string(),
				isPrimary: z.boolean(),
			}),
		)
		.mutation(async ({ input }) => {
			return prisma.image.create({
				data: {
					productId: input.productId,
					url: input.url,
					isPrimary: input.isPrimary,
				},
			});
		}),
	listf: publicProcedure
		.input(
			z4.object({
				limit: z4.number().min(10).max(100).default(20),
				offset: z4.number().min(0).default(0),
			}),
		)
		.query(async ({ input }) => {
			const products = await prisma.product.findMany({
				take: input.limit,
				skip: input.offset,
				include: {
					images: true,
					category: true,
					_count: { select: { reviews: true } },
				},
			});
			const totalCount = await prisma.product.count();
			return { products, totalCount };
		}),

	/**
	 * THE MASTER LIST ENDPOINT
	 * Handles: Search, Filtering, Sorting, Pagination, "New Deals", "Exclusive"
	 */
	list: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(20),
				cursor: z.string().nullish(),
				filters: z
					.object({
						search: z.string().optional(),
						categorySlug: z.string().optional(),
						minPrice: z.number().optional(),
						maxPrice: z.number().optional(),
						rating: z.number().min(1).max(5).optional(),

						isNew: z.boolean().optional(),
						hasDiscount: z.boolean().optional(),
						inStock: z.boolean().default(true),
					})
					.optional(),
				sort: z
					.enum([
						"newest",
						"price_asc",
						"price_desc",
						"top_rated",
						"best_selling",
					])
					.default("newest"),
			}),
		)
		.query(async ({ input }) => {
			const { limit, sort, cursor, filters } = input;
			// 1. Build Dynamic 'Where' Clause
			const where: Prisma.ProductWhereInput = {
				isActive: true,
			};
			// Search (Name, Description, or SKU)
			if (filters) {
				if (filters.search) {
					where.OR = [
						{ name: { contains: filters.search, mode: "insensitive" } },
						{ description: { contains: filters.search, mode: "insensitive" } },
					];
				}
				// Category Filter
				if (filters.categorySlug) {
					where.category = { slug: filters.categorySlug };
				}
				// Price Range
				if (filters.minPrice || filters.maxPrice) {
					where.price = {
						gte: filters.minPrice,
						lte: filters.maxPrice,
					};
				}

				// "Exclusive Deals" Logic (Has a discount price)
				if (filters.hasDiscount) {
					where.discountPrice = { not: null };
				}

				//"New Arrivals" Logic (Added in last 30 days)
				if (filters.isNew) {
					const thirtyDaysAgo = new Date();
					thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
					where.createdAt = { gte: thirtyDaysAgo };
				}
				//Stock Logic
				if (filters.inStock) {
					where.stock = { gt: 0 };
				}
			}
			let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

			switch (sort) {
				case "price_asc":
					orderBy = [{ price: "asc" }];
					break;
				case "price_desc":
					orderBy = [{ price: "desc" }];
					break;
				case "newest":
					orderBy = [{ createdAt: "desc" }];
					break;
				// Note: 'best_selling' and 'top_rated' usually require aggregate fields
				// or separate tables/metrics. For simplicity, we fallback to new here
				// unless you add fields like 'averageRating' or 'salesCount' to your schema.
				default:
					orderBy = [{ createdAt: "desc" }];
					break;
			}
			//Execute Query
			const items = await prisma.product.findMany({
				take: limit + 1,
				cursor: cursor ? { id: cursor } : undefined,
				where,
				orderBy,
				select: productListSelect,
			});

			// Handle Pagination Result
			let nextCursor: typeof cursor | undefined;
			if (items.length > limit) {
				const nextItem = items.pop();
				nextCursor = nextItem!.id;
			}

			return { items, nextCursor };
		}),

	/**
	 * GET SINGLE PRODUCT
	 * Optimized to find by Slug (SEO) or ID (Internal)
	 */
	getBySlugOrId: publicProcedure
		.input(
			z
				.object({
					slug: z.string().optional(),
					id: z.string().optional(),
				})
				.refine((data) => data.slug || data.id, "Slug or ID must be provided"),
		)
		.query(async ({ input }) => {
			const where = input.slug ? { slug: input.slug } : { id: input.id };

			const product = await prisma.product.findUnique({
				where,
				include: productDetailInclude,
			});
			if (!product) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found",
				});
			}
			return product;
		}),

	/**
	 * GET RELATED PRODUCTS
	 * Logic: Same Category, excluding current product
	 */
	getRelated: publicProcedure
		.input(
			z.object({
				productId: z.string(),
				cateogryId: z.string().optional(),
				limit: z.number().default(4),
			}),
		)
		.query(async ({ input }) => {
			//if no category provided, fetch product to find category first
			let categoryId = input.cateogryId;
			if (!categoryId) {
				const p = await prisma.product.findUnique({
					where: { id: input.productId },
					select: { categoryId: true },
				});
				categoryId = p?.categoryId || undefined;
			}
			if (!categoryId) return [];
			return prisma.product.findMany({
				where: {
					categoryId,
					id: { not: input.productId },
					isActive: true,
				},
				take: input.limit,
				select: productListSelect,
			});
		}),
});
