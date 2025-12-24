import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { Cart } from "@/feature/cart";

import { useShop } from "../context/ShopContext";
import Button from "./ui/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { updateQuantity, removeFromCart } = useShop();
  const { data: cart, isLoading } = Cart.hooks.useCart();

  if (isLoading) {
    return <div>cart is loading</div>;
  }

  if (!cart) {
    return <div>cart is undefined or null</div>;
  }
  const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">Shopping Cart ({cart.items.length})</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <ShoppingBag size={48} />
                <p>Your cart is empty.</p>
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group"
                >
                  <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative">
                    {item.product.images.map((image) => (
                      <Image
                        key={image.id}
                        src={image.url}
                        alt={image.altText || item.product.name}
                        className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-105"
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                      <span className="font-bold text-sm">${item.product.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.product.category?.name} {item.color && `• Color`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded-l-full transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 rounded-r-full transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex-1"
                >
                  <Button
                    variant="secondary"
                    className="w-full border border-gray-200 hover:bg-white"
                  >
                    View Cart
                  </Button>
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex-[2]"
                >
                  <Button className="w-full justify-between group">
                    Checkout{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
