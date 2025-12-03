import { ChevronRight } from "lucide-react";
import Link from "next/link";
const formatCategoryTitle = (slugs: string[]) => {
    if (!slugs || slugs.length === 0) return 'All Categories'
    return slugs[slugs.length - 1].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

const CategoryHeader = ({ slugs }: { slugs: string[] }) => {
    // Simple title case function for display
    const toTitleCase = (str: string) => str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="mb-8">
            <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="mx-2 h-4 w-4" />
                {slugs.length > 0 && (
                    <>
                        <Link href="/category" className="hover:text-primary">Categories</Link>
                        <ChevronRight className="mx-2 h-4 w-4" />
                    </>
                )}

                {slugs.map((segment, index) => {
                    // Construct the full absolute path segment by segment
                    const fullPathForLink = slugs.slice(0, index + 1).join('/');
                    const isLast = index === slugs.length - 1;

                    return (
                        // Use `key={fullPathForLink}` for robust React keying.
                        <div key={fullPathForLink} className="flex items-center">
                            {/* No chevron needed before the first slug segment if "Categories" base is shown */}
                            {/* If "Categories" base is NOT shown, then idx > 0 would be correct here */}
                            {index > 0 && <ChevronRight className="mx-2 h-4 w-4" />} {/* Only show chevron if it's not the first segment and NO base categories link */}

                            {isLast ? (
                                <span className='capitalize'>{segment.replace(/-/g, ' ')}</span>
                            ) : (
                                // THE FIX IS HERE 👇
                                // Ensure the href is always absolute from the root `/categories/`
                                <Link href={`/category/${fullPathForLink}`} className='hover:text-primary capitalize'>
                                    {segment.replace(/-/g, ' ')}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mt-4">
                {formatCategoryTitle(slugs)}Collection
            </h1>
        </div>
    );
};

export default CategoryHeader