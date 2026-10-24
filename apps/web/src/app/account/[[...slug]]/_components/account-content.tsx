"use client";

import type { Session } from "@ecommerceNextjs/auth";

import { AccountSidebar } from "@/components/features/account/AccountSidebar";
import { AccountOverview } from "@/components/features/account/AccountOverview";
import { AccountOrders } from "@/components/features/account/AccountOrders";
import { AccountWishlist } from "@/components/features/account/AccountWishlist";
import { AccountAddresses } from "@/components/features/account/AccountAddresses";
import { AccountSettings } from "@/components/features/account/AccountSettings";
import { AccountReviews } from "./account-reviews";

interface Props {
  activeTab: string;
  user: Session["user"];
}

export function AccountContent({ activeTab, user }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] p-4 pb-12 md:px-8">
      {/* Header */}
      <div className="mt-4 mb-8 flex items-end justify-between">
        <div>
          <h1 className="mb-2 font-light text-4xl">Hello, {user.name}</h1>
          <p className="text-gray-500">Manage your orders and preferences.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <AccountSidebar activeTab={activeTab} user={user} />

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "overview" && <AccountOverview />}
          {activeTab === "orders" && <AccountOrders />}
          {activeTab === "wishlist" && <AccountWishlist />}
          {activeTab === "addresses" && <AccountAddresses />}
          {activeTab === "settings" && <AccountSettings user={user} />}
          {activeTab === "reviews" && <AccountReviews />}
          {/* Payment placeholder if needed */}
        </main>
      </div>
    </div>
  );
}