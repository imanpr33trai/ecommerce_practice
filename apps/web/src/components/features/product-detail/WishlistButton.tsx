"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "@/components/Button";
import { useToggleWishlistMutation } from "@/hooks/mutations/useToggleWishlistMutation";
import { authClient } from "@/lib/auth-client";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  isWishlisted: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "icon-only" | "with-label";
  size?: "sm" | "md" | "lg";
}

export default function WishlistButton({
  productId,
  productName,
  isWishlisted,
  disabled = false,
  className = "",
  variant = "default",
  size = "md",
}: WishlistButtonProps) {
  const { data: session } = authClient.useSession();
  const [optimisticWishlisted, setOptimisticWishlisted] = useState(isWishlisted);
  const { mutate: toggleWish, isPending } = useToggleWishlistMutation();

  const handleClick = () => {
    if (!session) {
      toast.error("Please login to save items");
      return;
    }

    if (disabled) return;

    // Optimistic update
    setOptimisticWishlisted((prev) => !prev);
    toggleWish(productId, {
      onError: () => {
        // Rollback on error
        setOptimisticWishlisted(isWishlisted);
        toast.error("Failed to update wishlist");
      },
      onSuccess: (data) => {
        if ("data" in data) {
          toast.success(data.data.message);
        }
      },
    });
  };

  const isLoading = isPending;
  const isDisabled = disabled || isLoading;

  const sizeClasses = {
    sm: "h-8 w-8 p-0",
    md: "h-10 w-10 p-0",
    lg: "h-12 w-12 p-0",
  };

  const iconOnlyClasses = `
    rounded-full transition-all duration-200
    ${optimisticWishlisted ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  const defaultClasses = `
    flex items-center justify-center gap-2 rounded-lg border-2 transition-all duration-200
    ${optimisticWishlisted
      ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}
    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  if (variant === "icon-only") {
    return (
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        className={`${sizeClasses[size]} ${iconOnlyClasses} ${className}`}
        aria-label={optimisticWishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
        aria-pressed={optimisticWishlisted}
      >
        <Heart size={size === "sm" ? 16 : size === "md" ? 20 : 24} className={`${optimisticWishlisted ? "fill-current" : ""}`} aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      size={size}
      variant={optimisticWishlisted ? "secondary" : "outline"}
      className={`${defaultClasses} ${className}`}
      aria-pressed={optimisticWishlisted}
    >
      <Heart size={size === "sm" ? 14 : size === "md" ? 18 : 20} className={`${optimisticWishlisted ? "fill-current" : ""}`} aria-hidden="true" />
      {(variant === "default" || variant === "with-label") && (
        <span>{optimisticWishlisted ? "Saved" : "Save"}</span>
      )}
    </Button>
  );
}