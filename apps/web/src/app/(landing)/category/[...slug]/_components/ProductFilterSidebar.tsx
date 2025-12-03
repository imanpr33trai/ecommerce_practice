'use client';

import { Button } from '@/_components/client/button';
import { Checkbox } from '@comp/checkbox';
import { Label } from '@comp/label';
import { useCategory } from '@/hooks/useCategory';
import { useState } from 'react';

import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

// TODO: Integrate actual filter state and tRPC queries for filter options here.
// For now, it's a design placeholder.

interface ProductFiltersSidebarProps {
    currentCategorySlug: string;

}

export const ProductFiltersSidebar = ({ currentCategorySlug }: ProductFiltersSidebarProps) => {

    const { data: categoryData, isLoading: isCateogryLoading, isError: isCategoryError } = useCategory.bySlugWithChildren(currentCategorySlug)
    const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())

    const toggleSubcategory = (slug: string) => {
        setExpandedSubcategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(slug)) {
                newSet.delete(slug);
            } else {
                newSet.add(slug);
            }
            return newSet
        })
    }

    return (
        <aside className="hidden lg:block">
            <div className="space-y-8"> {/* Increased spacing */}
                {/* Material Filter */}
                {isCateogryLoading &&
                    <p className='text-muted-foreground'>Loading Categories...</p>
                }
                {isCategoryError && <p className='text-red-500'>Error loading categories.</p>}


                <div>
                    <h3 className="font-bold mb-4 text-lg text-foreground">Material</h3>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2"><Checkbox id="wood" /><Label htmlFor="wood">Wood</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="metal" /><Label htmlFor="metal">Metal</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="fabric" /><Label htmlFor="fabric">Fabric</Label></div>
                    </div>
                </div>

                {/* Color Filter */}
                {categoryData && categoryData?.children && categoryData.children.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-4 text-lg text-foreground">Subcategory</h3>
                        <div className='space-y-2'>
                            {categoryData.children.map(child => (
                                <div key={child.id} className='flex items-center justify-between py-1'>
                                    <Link href={`/category/${currentCategorySlug}/${child.slug}`} className='text-white hover:text-blue-400 transition-colors'>
                                        {child.name} ({child._count.products})
                                    </Link>
                                    {/* {child.}<Button variant={'ghost'} size={'icon'} onClick={() => toggleSubcategory(child.slug)}>
                                        {expandedSubcategories.has(child.slug) ? <ChevronDown /> : <ChevronRight />}
                                    </Button> */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range Slider (Placeholder) */}
                <div>
                    <h3 className="font-bold mb-4 text-lg text-foreground">Price Range</h3>
                    <p className="text-sm text-muted-foreground">($50 - $1000)</p> {/* Placeholder for a slider */}
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Apply Filters</Button>
                </div>
            </div>
        </aside>
    );
};