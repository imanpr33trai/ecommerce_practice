import { ProductDetailPageClient } from "./_components/ProductDetailPageClient"; // 👈 Import your existing client component

// This is a Server Component, so `params` can be awaited if needed (though not strictly necessary here as it's often already resolved).
// The `params` object is always an object in this context. The warning you saw applies more to `searchParams` sometimes.
// However, to be absolutely future-proof and follow the suggestion:
export default async function Page({
	params,
}: {
	params: { productSlug: string };
}) {
	// Access params directly here in the Server Component context.
	// The warning you got is a bit overzealous for `params` in a Server Component,
	// it usually applies more to `searchParams` if you try to `await` it.
	// But Next.js's future vision for `React.use` is to "unwrap" props that might be Promises.
	const productSlug = params.productSlug;
	// No need for `await params` here unless you specifically make `params` a Promise in middleware or parent.

	return <ProductDetailPageClient productSlug={productSlug} />;
}
