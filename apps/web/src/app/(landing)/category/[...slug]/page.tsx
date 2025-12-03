import MaxWidthWrapper from "@/_components/max-width-wrapper"
import CategoryHeader from "./_components/CategoryPageHeader"
import { ProductFiltersSidebar } from "./_components/ProductFilterSidebar"
import { ProductGridSection } from "./_components/ProductGridSection"


export default function CategoryPage({ params }: { params: { slug: string[] } }) {

    const { slug: slugArray } = params
    const currentCategorySlug = slugArray[slugArray.length - 1]
    return (
        <MaxWidthWrapper className="py-8">
            <CategoryHeader slugs={slugArray} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <ProductFiltersSidebar currentCategorySlug={currentCategorySlug} />
                <ProductGridSection slugs={slugArray} />
            </div>
        </MaxWidthWrapper>
    )
}