"use client";

import Link from "next/link";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { Bell, Heart, Package } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { Account } from "@/feature/account";
import { Order } from "@/feature/order";

export function AccountOverview() {
  const { data: profile } = Account.hooks.useProfile();
  const { data: orders, isLoading: ordersLoading } = Order.hooks.useList();

  // 1. Safely grab the first order if it exists
  const recentOrder = orders?.[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard className="p-6 bg-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <span className="block text-2xl font-bold">{profile?._count?.order ?? 0}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Orders</span>
          </div>
        </BentoCard>
        <BentoCard className="p-6 bg-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <Heart
              size={24}
              fill="currentColor"
            />
          </div>
          <div>
            <span className="block text-2xl font-bold">{profile?._count?.wishList ?? 0}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Wishlist Items</span>
          </div>
        </BentoCard>
        <BentoCard className="p-6 bg-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <Bell size={24} />
          </div>
          <div>
            <span className="block text-2xl font-bold">2</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Notifications</span>
          </div>
        </BentoCard>
      </div>

      {/* Recent Order Section */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold">Recent Order</h3>
          <Link
            href="/account/orders"
            className="text-sm text-gray-500 hover:text-black"
          >
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
          <div className="p-6 rounded-3xl border border-dashed border-gray-300 text-center text-gray-500 text-sm">
            No orders placed yet.
          </div>
        ) : (
          <BentoCard className="p-6 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">
                  {recentOrder.items.length} Items
                </div>
                <div>
                  <h4 className="font-bold">Order #{recentOrder.id.slice(-6)}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(recentOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full md:w-auto"
              >
                Track Order
              </Button>
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  );
}
