import type React from "react";

interface SkeletonProps {
  type?: "home" | "products" | "detail" | "account" | "generic";
}

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full skew-x-12 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

const SkeletonItem = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-[2rem] bg-gray-200/60 ${className}`}>
    <Shimmer />
  </div>
);

const LoadingSkeleton: React.FC<SkeletonProps> = ({ type = "generic" }) => {
  const renderHomeSkeleton = () => (
    <div className="animate-fade-in space-y-8">
      <div className="grid h-[500px] grid-cols-1 gap-4 lg:grid-cols-12">
        <SkeletonItem className="lg:col-span-8" />
        <SkeletonItem className="lg:col-span-4" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SkeletonItem className="h-24" />
        <SkeletonItem className="h-24" />
        <SkeletonItem className="h-24" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonItem key={i} className="h-[400px] min-w-[300px] shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductsSkeleton = () => (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-12 w-64 rounded-lg bg-gray-200" />
          <div className="h-4 w-48 rounded-lg bg-gray-200/60" />
        </div>
        <div className="h-10 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <SkeletonItem className="aspect-[4/5]" />
            <div className="space-y-2 px-2">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="animate-fade-in space-y-8">
      <div className="h-6 w-32 rounded bg-gray-200" />
      <div className="grid h-[700px] grid-cols-1 gap-4 lg:grid-cols-12">
        <SkeletonItem className="lg:col-span-8" />
        <div className="flex flex-col gap-4 lg:col-span-4">
          <SkeletonItem className="flex-1" />
          <SkeletonItem className="h-48" />
          <SkeletonItem className="h-32" />
        </div>
      </div>
    </div>
  );

  const renderAccountSkeleton = () => (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-10 w-48 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200/60" />
        </div>
        <div className="h-10 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full space-y-4 md:w-64">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-2xl bg-gray-200/40" />
          ))}
        </div>
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
          <SkeletonItem className="col-span-full h-64" />
          <SkeletonItem className="h-40" />
          <SkeletonItem className="h-40" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] p-4 pt-4 md:px-8">
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
