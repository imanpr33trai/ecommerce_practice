import type React from "react";

interface SkeletonProps {
  type?: "home" | "products" | "detail" | "account" | "generic";
}

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] skew-x-12" />
);

const SkeletonItem = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-200/60 rounded-[2rem] ${className}`}>
    <Shimmer />
  </div>
);

const LoadingSkeleton: React.FC<SkeletonProps> = ({ type = "generic" }) => {
  const renderHomeSkeleton = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px]">
        <SkeletonItem className="lg:col-span-8" />
        <SkeletonItem className="lg:col-span-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonItem className="h-24" />
        <SkeletonItem className="h-24" />
        <SkeletonItem className="h-24" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonItem
              key={i}
              className="min-w-[300px] h-[400px] shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductsSkeleton = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-12 w-64 bg-gray-200 rounded-lg" />
          <div className="h-4 w-48 bg-gray-200/60 rounded-lg" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="space-y-4"
          >
            <SkeletonItem className="aspect-[4/5]" />
            <div className="space-y-2 px-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[700px]">
        <SkeletonItem className="lg:col-span-8" />
        <div className="lg:col-span-4 flex flex-col gap-4">
          <SkeletonItem className="flex-1" />
          <SkeletonItem className="h-48" />
          <SkeletonItem className="h-32" />
        </div>
      </div>
    </div>
  );

  const renderAccountSkeleton = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200/60 rounded" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200/40 rounded-2xl"
            />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonItem className="h-64 col-span-full" />
          <SkeletonItem className="h-40" />
          <SkeletonItem className="h-40" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto pt-4">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
      {type === "home" && renderHomeSkeleton()}
      {type === "products" && renderProductsSkeleton()}
      {type === "detail" && renderDetailSkeleton()}
      {type === "account" && renderAccountSkeleton()}
      {type === "generic" && (
        <div className="space-y-8">
          <SkeletonItem className="h-64" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonItem className="h-32" />
            <SkeletonItem className="h-32" />
            <SkeletonItem className="h-32" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSkeleton;
