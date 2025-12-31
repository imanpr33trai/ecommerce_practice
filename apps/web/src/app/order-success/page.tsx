import Link from "next/link";
import React, { useEffect } from "react";

import confetti from "canvas-confetti";
import { ArrowRight, Check, Download, Package } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";

export default function OrderSuccessPage() {
  useEffect(() => {
    // Trigger confetti on load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-slide-up">
        <BentoCard className="bg-white p-8 md:p-12 text-center overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-50 rounded-full blur-3xl"></div>

          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-[bounce_1s_infinite]">
            <Check
              size={48}
              className="text-green-600"
              strokeWidth={3}
            />
          </div>

          <h1 className="text-4xl font-light mb-4">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Thank you for your purchase. We've received your order and will send you an email with tracking details shortly.</p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-sm text-gray-500">Order Number</span>
              <span className="font-bold font-mono">#NES-88291</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Estimated Delivery</span>
              <span className="font-bold">Oct 24 - Oct 26</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/product">
              <Button className="w-full sm:w-auto px-8">Continue Shopping</Button>
            </Link>
            <Link href={{pathname:"/account"}}>
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <Package size={18} /> View Order
              </Button>
            </Link>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
