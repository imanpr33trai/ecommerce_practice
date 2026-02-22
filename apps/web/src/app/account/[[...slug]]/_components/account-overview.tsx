"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { Bell, Heart, Package } from "lucide-react";
import Link from "next/link";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useUserProfileQuery } from "@/data/account/use-user-profile";
import { useOrderListQuery } from "@/data/order";

export function AccountOverview() {
  const { data: profile } = useUserProfileQuery();
  const { data: orders, isLoading: ordersLoading } = useOrderListQuery();

  // 1. Safely grab the first order if it exists
  const recentOrder = orders.data[0];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <BentoCard className="flex items-center gap-4 bg-white p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Package size={24} />
          </div>
          <div>
            <span className="block font-bold text-2xl">{profile?._count?.order ?? 0}</span>
            <span className="text-gray-500 text-xs uppercase tracking-wider">Total Orders</span>
          </div>
        </BentoCard>
        <BentoCard className="flex items-center gap-4 bg-white p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-500">
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <span className="block font-bold text-2xl">{profile?._count?.wishList ?? 0}</span>
            <span className="text-gray-500 text-xs uppercase tracking-wider">Wishlist Items</span>
          </div>
        </BentoCard>
        <BentoCard className="flex items-center gap-4 bg-white p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <Bell size={24} />
          </div>
          <div>
            <span className="block font-bold text-2xl">2</span>
            <span className="text-gray-500 text-xs uppercase tracking-wider">Notifications</span>
          </div>
        </BentoCard>
      </div>

      {/* Recent Order Section */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="font-bold text-xl">Recent Order</h3>
          <Link href="/account/orders" className="text-gray-500 text-sm hover:text-black">
            View All
          </Link>
        </div>

        {/*
             LOGIC FLOW:
             1. Loading -> Show Skeleton
             2. Data loaded but empty -> Show "No orders"
             3. Data loaded and exists -> Show Card
          */}
        {ordersLoading ? (
          <Skeleton className="h-32 w-full rounded-3xl" />
        ) : !recentOrder ? (
          <div className="rounded-3xl border border-gray-300 border-dashed p-6 text-center text-gray-500 text-sm">
            No orders placed yet.
          </div>
        ) : (
          <BentoCard className="bg-white p-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex w-full items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 font-medium text-gray-400 text-xs">
                  {recentOrder.items.length} Items
                </div>
                <div>
                  <h4 className="font-bold">Order #{recentOrder.id.slice(-6)}</h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(recentOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full md:w-auto">
                Track Order
              </Button>
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  );
}
