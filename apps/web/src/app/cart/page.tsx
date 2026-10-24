import { Suspense } from "react";

import { fetchCart } from "@/hooks/queries/useCartQuery";
import CartPageClient from "@/components/features/cart/CartPageClient";
import CartSkeleton from "./CartSkeleton";

export const metadata = {
  title: "Your Cart",
  description: "View and manage your shopping cart",
};

async function getCartData() {
  const cart = await fetchCart();
  return cart;
}

export default async function CartPage() {
  const cartData = await getCartData();

  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartPageClient initialCartData={cartData} />
    </Suspense>
  );
}