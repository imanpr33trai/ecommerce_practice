import MaxWidthWrapper from "@/_components/max-width-wrapper";
import { useCategory } from "@/hooks/useCategory";
import CategoryHeader from "./_components/CategoryPageHeader";
import { ProductFiltersSidebar } from "./_components/ProductFilterSidebar";
import { ProductGridSection } from "./_components/ProductGridSection";

interface PageProps {
	params:{
		slug:string[]
	}
}


export default async function CategoryPage({
	params,
}: {
	params: { slug: string[] };
}) {
const currentSlug = params.slug[params.slug.length - 1];

if(!currentSlug) {
	console.log("not found the ", currentSlug);
	return;
}

const category = await useCategory.getBySlug(currentSlug)

	return (
		<MaxWidthWrapper className="py-8">
			<CategoryHeader slugs={currentSlug} />

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				<ProductFiltersSidebar currentCategorySlug={currentSlug} />
				<ProductGridSection slugs={currentSlug} />
			</div>
		</MaxWidthWrapper>
	);
}
