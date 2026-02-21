import { useState } from "react";
import type React from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = "",
  containerClassName = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-200/80 ${containerClassName}`}>
      {/* Skeleton Shimmer Overlay */}
      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            className="absolute inset-0 -translate-x-full animate-[luxury-shimmer_2.5s_infinite_ease-in-out]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 60%, transparent 100%)",
              transform: "skewX(-25deg)",
            }}
          />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-1000 ease-premium ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
