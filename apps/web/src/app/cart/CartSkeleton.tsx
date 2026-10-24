import BentoCard from "@/components/BentoCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartSkeleton() {
  return (
    <div className="mx-auto min-h-[80vh] max-w-[1200px] animate-fade-in p-4 md:px-8">
      <Breadcrumbs />
      <div className="mb-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Skeleton items */}
          {[1, 2, 3].map((i) => (
            <BentoCard key={i} className="flex items-center gap-4 bg-white p-4">
              <div className="h-24 w-24 shrink-0 rounded-2xl bg-gray-100" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-10 w-32 bg-gray-200 rounded-full" />
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded" />
            </BentoCard>
          ))}
          <div className="h-12 w-48 bg-gray-200 rounded mt-4" />
        </div>

        <div className="lg:col-span-1">
          <BentoCard className="sticky top-24 p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="my-4 h-px bg-gray-200" />
              <div className="flex justify-between">
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-xl" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto" />
          </BentoCard>
        </div>
      </div>
    </div>
  );
}