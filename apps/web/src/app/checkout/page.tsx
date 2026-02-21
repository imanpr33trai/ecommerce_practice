"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type React from "react";

import { ArrowRight, CheckCircle, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import BentoCard from "@/components/BentoCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { useAddAddressQuery } from "@/data/account/use-add-address";
import { useUserAddressQuery } from "@/data/account/use-user-address";
import { useCartListItemsQuery } from "@/data/cart";
import { useOrderCreateFromCartMutaiton } from "@/data/order";
import { formatCurrency } from "@/lib/format-currency";

export default function CheckoutPage() {
  const router = useRouter();

  // --- STATE ---
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetLine1: "",
    city: "",
    postalCode: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  // --- HOOKS ---
  const { data: cartData, isLoading: isCartLoading } = useCartListItemsQuery();
  const { data: addressesData } = useUserAddressQuery();

  // We need mutateAsync to await the address creation before placing order
  const { mutateAsync: createAddress } = useAddAddressQuery();
  const { mutate: placeOrder, isPending: isProcessing } = useOrderCreateFromCartMutaiton();

  // --- DERIVED STATE ---
  const cartItems = cartData?.data.items || [];
  const subtotal = cartData?.data.subtotal || 0;
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;
  const addresses = addressesData?.data;
  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Select an existing address
  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    // Optional: Pre-fill form if needed
    const addr = addresses?.find((a) => a.id === id);
    if (addr) {
      setFormData((prev) => ({
        ...prev,
        firstName: addr.fullName.split(" ")[0] || "",
        lastName: addr.fullName.split(" ")[1] || "",
        streetLine1: addr.streetLine1,
        city: addr.city,
        postalCode: addr.postalCode,
      }));
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Move to payment step
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalAddressId = selectedAddressId;

    // Logic: If no existing address is selected, create a new one from form data
    if (!finalAddressId) {
      // Validate Form Data exists
      if (!formData.firstName || !formData.streetLine1 || !formData.postalCode) {
        toast.error("Please fill out shipping details");
        return;
      }

      try {
        const newAddress = await createAddress({
          fullName: `${formData.firstName} ${formData.lastName}`,
          streetLine1: formData.streetLine1,
          city: formData.city,
          state: "NY", // Hardcoded for MVP
          postalCode: formData.postalCode,
          country: "US", // Hardcoded for MVP
          type: "SHIPPING",
          isDefault: !addresses || addresses.length === 0,
        });

        // Capture the new ID
        if (newAddress?.data.id) {
          finalAddressId = newAddress.data.id;
        } else {
          throw new Error("Failed to retrieve new address ID");
        }
      } catch (error) {
        toast.error("Failed to save address. Please try again.");
        return;
      }
    }

    // Proceed to checkout
    if (finalAddressId) {
      placeOrder({
        addressId: finalAddressId,
        paymentProvider: "stripe",
      });
    }
  };

  // --- REDIRECTS ---
  useEffect(() => {
    if (!isCartLoading && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isCartLoading, cartItems, router]);

  if (isCartLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading Checkout...</div>;
  }

  if (cartItems.length === 0) {
    return null; // Avoid flash of content before redirect
  }
  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in p-4 pb-12 md:px-8">
      <Breadcrumbs />
      <h1 className="mb-8 font-light text-4xl">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* STEP 1: SHIPPING */}
          <BentoCard
            className={`bg-white p-8 transition-opacity duration-300 ${step === 2 ? "pointer-events-none opacity-50 grayscale" : "opacity-100"}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-bold text-sm text-white">
                  1
                </div>
                <h2 className="font-bold text-xl">Shipping Information</h2>
              </div>
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  type="button"
                  className="font-bold text-sm underline"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Existing Addresses Quick Select */}
            {addresses && addresses.length > 0 && step === 1 && (
              <div className="mb-4 flex gap-4 overflow-x-auto pb-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr.id)}
                    className={`min-w-[200px] cursor-pointer rounded-xl border p-4 transition-all ${selectedAddressId === addr.id ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-sm">{addr.fullName}</span>
                      {selectedAddressId === addr.id && <CheckCircle size={16} />}
                    </div>
                    <p className="mt-2 truncate text-gray-500 text-xs">{addr.streetLine1}</p>
                    <p className="text-gray-500 text-xs">
                      {addr.city}, {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <form
              id="shipping-form"
              className="space-y-4"
              onSubmit={handleShippingSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="First Name"
                  className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                />
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Last Name"
                  className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                />
              </div>
              <input
                required
                name="streetLine1"
                value={formData.streetLine1}
                onChange={handleInputChange}
                type="text"
                placeholder="Street Address"
                className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="City"
                  className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                />
                <input
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Postal Code"
                  className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                />
              </div>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email for receipt"
                className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
              />

              {step === 1 && (
                <div className="pt-4">
                  <Button type="submit">Continue to Payment</Button>
                </div>
              )}
            </form>
          </BentoCard>

          {/* STEP 2: PAYMENT */}
          <BentoCard
            className={`bg-white p-8 transition-all duration-300 ${step === 1 ? "pointer-events-none opacity-50" : "opacity-100 ring-2 ring-black"}`}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${step === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <h2 className="font-bold text-xl">Payment Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-800 shadow-sm">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Credit Card</h3>
                  <p className="text-gray-500 text-xs">Secure 256-bit SSL encryption</p>
                </div>
                <div className="ml-auto">
                  <Lock
                    size={16}
                    className="text-gray-400"
                  />
                </div>
              </div>

              <form
                id="payment-form"
                onSubmit={handlePlaceOrder}
                className="space-y-4"
              >
                <input
                  required
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Card Number (Mock)"
                  className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                  />
                  <input
                    required
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="CVC"
                    className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                  />
                </div>
                <input
                  required
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black/10"
                />
              </form>
            </div>
          </BentoCard>

          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
            <ShieldCheck size={14} />
            <span>Payments are secure and encrypted</span>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-4">
          <BentoCard className="sticky top-24 border border-gray-100 bg-gray-50 p-6">
            <h3 className="mb-6 font-bold text-lg">Order Summary</h3>

            <div className="mb-6 max-h-[300px] space-y-4 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
                    <Image
                      src={item.product.images[0]?.url || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="line-clamp-1 font-bold text-sm">{item.product.name}</h4>
                      <span className="font-medium text-sm">${Number(item.product.price)}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{item.product.category?.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 h-px bg-gray-200"></div>

            <div className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-black text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={step === 1 || isProcessing}
              className={`group w-full justify-between ${step === 1 ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
              {!isProcessing && (
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </Button>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
