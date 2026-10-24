"use client";

import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "@/components/Button";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { authClient } from "@/lib/auth-client";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  selectedColor?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export default function AddToCartButton({
  productId,
  productName,
  selectedColor,
  quantity = 1,
  disabled = false,
  className = "",
  onSuccess,
}: AddToCartButtonProps) {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: addToCart, isPending } = useAddToCartMutation();

  const handleClick = () => {
    if (!session) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (disabled) {
      return;
    }

    setIsLoading(true);
    addToCart(
      {
        productId,
        quantity,
        color: selectedColor,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast.success(`${productName} added to cart`);
          onSuccess?.();
        },
        onError: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const isDisabled = disabled || isPending || isLoading || !session;

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      size="lg"
      className={`w-full gap-2 ${className}`}
      aria-busy={isPending || isLoading}
    >
      {isPending || isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart size={20} aria-hidden="true" />
          Add to Cart
        </>
      )}
    </Button>
  );
}