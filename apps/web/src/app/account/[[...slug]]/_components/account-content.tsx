"use client";

// import type { User } from "better-auth";
import type { Session } from "@ecomerceNextjs/auth";

import {
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Image from "@/components/AppImage";
import Button from "@/components/Button";
import { authClient } from "@/lib/auth-client";

import { AccountAddresses } from "./account-addresses";
import { AccountOrders } from "./account-orders";
import { AccountOverview } from "./account-overview";
import { AccountReviews } from "./account-reviews";
import { AccountSettings } from "./account-settings";

interface Props {
  activeTab: string;
  user: Session["user"];
}

export function AccountContent({ activeTab, user }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/account" },
    { id: "orders", label: "Orders", icon: Package, path: "/account/orders" },
    { id: "reviews", label: "My Reviews", icon: MessageSquare, path: "/account/reviews" },
    { id: "addresses", label: "Addresses", icon: MapPin, path: "/account/addresses" },
    { id: "payment", label: "Payment", icon: CreditCard, path: "/account/payment" },
    { id: "settings", label: "Settings", icon: Settings, path: "/account/settings" },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] p-4 pb-12 md:px-8">
      {/* Header */}
      <div className="mt-4 mb-8 flex items-end justify-between">
        <div>
          <h1 className="mb-2 font-light text-4xl">Hello, {user.name}</h1>
          <p className="text-gray-500">Manage your orders and preferences.</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-red-200 text-red-500 hover:bg-red-50">
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-8 md:w-72">
          <div className="flex items-center gap-4 px-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
              {user.image && <Image src={user.image} alt="Profile" fill className="object-cover" />}
            </div>
            <div>
              <h2 className="font-bold leading-tight">{user.name}</h2>
              <p className="max-w-[150px] truncate text-gray-500 text-xs">{user.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: item.path }}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${activeTab === item.id ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-white"}
                `}>
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className={
                      activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-black"
                    }
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "overview" && <AccountOverview />}
          {activeTab === "orders" && <AccountOrders />}
          {activeTab === "addresses" && <AccountAddresses />}
          {activeTab === "settings" && <AccountSettings user={user} />}
          {activeTab === "reviews" && <AccountReviews />}
          {/* Payment placeholder if needed, or default behavior */}
        </main>
      </div>
    </div>
  );
}
