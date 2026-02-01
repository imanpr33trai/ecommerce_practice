"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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

import Image from "@/components/AppImage";
import Button from "@/components/Button";
import { authClient } from "@/lib/auth-client";

import { AccountAddresses } from "./account-addresses";
import { AccountOrders } from "./account-orders";
import { AccountOverview } from "./account-overview";
import { AccountReviews } from "./account-reviews";
import { AccountSettings } from "./account-settings";
// import type { User } from "better-auth";
import type { Session } from "@ecomerceNextjs/auth";

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
    <div className="p-4 md:px-8 max-w-[1600px] mx-auto pb-12 min-h-screen">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 mt-4">
        <div>
          <h1 className="text-4xl font-light mb-2">Hello, {user.name}</h1>
          <p className="text-gray-500">Manage your orders and preferences.</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          <LogOut
            size={16}
            className="mr-2"
          />{" "}
          Sign Out
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar */}
        <aside className="w-full md:w-72 shrink-0 space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
              {user.image && (
                <Image
                  src={user.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h2 className="font-bold leading-tight">{user.name}</h2>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: item.path }}
                className={`
                   flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group
                   ${activeTab === item.id ? "bg-black text-white shadow-lg" : "hover:bg-white text-gray-600"}
                `}
              >
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
