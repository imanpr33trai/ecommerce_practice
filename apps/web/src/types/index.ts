import type { RouterOutputs } from "@/utils/trpc";

// 1. The "Summary" type (for Product Cards / Lists)
// We look at the 'product' router -> 'list' procedure -> 'items' array -> single item
export type ProductSummary = RouterOutputs["product"]["list"]["items"][number];

export interface ProductSummaryProps {
  product: ProductSummary;
  isWishlisted: boolean; // boolean passed from outside
  onToggleWishlist: (productId: string) => void; // The handler passed from outside
}
// 2. The "Detail" type (for the full Product Page)
// We look at the 'product' router -> 'getBySlugOrId' procedure
export type ProductDetail = RouterOutputs["product"]["getBySlugOrId"];

// 3. Helper types (extracted from above)
export type ProductImage = ProductDetail["images"][number];
export type ProductCategory = ProductDetail["category"];

export type CartUpdateQuantity = RouterOutputs["cart"]["updateQuantity"];
