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
import { useCartListItemsQuery } from "@/data/cart";
import { Account } from "@/feature/account";
import { useCheckout } from "@/feature/checkout/client";
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
  const { data: addresses } = Account.hooks.useAddresses();

  // We need mutateAsync to await the address creation before placing order
  const { mutateAsync: createAddress } = Account.hooks.useAddAddress();
  const { mutate: placeOrder, isPending: isProcessing } = useCheckout();

  // --- DERIVED STATE ---
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.subtotal || 0;
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

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
        if (newAddress && newAddress.id) {
          finalAddressId = newAddress.id;
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
    return <div className="min-h-screen flex items-center justify-center">Loading Checkout...</div>;
  }

  if (cartItems.length === 0) {
    return null; // Avoid flash of content before redirect
  }
  return (
    <div className="p-4 md:px-8 max-w-[1400px] mx-auto animate-fade-in pb-12">
      <Breadcrumbs />
      <h1 className="text-4xl font-light mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: SHIPPING */}
          <BentoCard
            className={`p-8 bg-white transition-opacity duration-300 ${step === 2 ? "opacity-50 pointer-events-none grayscale" : "opacity-100"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  type="button"
                  className="text-sm font-bold underline"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Existing Addresses Quick Select */}
            {addresses && addresses.length > 0 && step === 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr.id)}
                    className={`min-w-[200px] p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-sm">{addr.fullName}</span>
                      {selectedAddressId === addr.id && <CheckCircle size={16} />}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 truncate">{addr.streetLine1}</p>
                    <p className="text-xs text-gray-500">
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
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                />
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                />
              </div>
              <input
                required
                name="streetLine1"
                value={formData.streetLine1}
                onChange={handleInputChange}
                type="text"
                placeholder="Street Address"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="City"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                />
                <input
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Postal Code"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                />
              </div>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email for receipt"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
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
            className={`p-8 bg-white transition-all duration-300 ${step === 1 ? "opacity-50 pointer-events-none" : "opacity-100 ring-2 ring-black"}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <h2 className="text-xl font-bold">Payment Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-800">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Credit Card</h3>
                  <p className="text-xs text-gray-500">Secure 256-bit SSL encryption</p>
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
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                  />
                  <input
                    required
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="CVC"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                  />
                </div>
                <input
                  required
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-transparent focus:border-black/10 outline-none"
                />
              </form>
            </div>
          </BentoCard>

          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-6">
            <ShieldCheck size={14} />
            <span>Payments are secure and encrypted</span>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-4">
          <BentoCard className="p-6 bg-gray-50 border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4"
                >
                  <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-gray-100 relative">
                    <Image
                      src={item.product.images[0]?.url || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                      <span className="text-sm font-medium">${Number(item.product.price)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.product.category?.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-200 my-4"></div>

            <div className="space-y-2 mb-6 text-sm">
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
              <div className="flex justify-between font-bold text-lg pt-2 text-black">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={step === 1 || isProcessing}
              className={`w-full justify-between group ${step === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
              {!isProcessing && (
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </Button>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
