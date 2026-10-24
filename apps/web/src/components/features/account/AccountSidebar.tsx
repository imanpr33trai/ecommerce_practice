"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChevronRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  Settings,
} from "lucide-react";
import type { Session } from "@ecommerceNextjs/auth";

import Image from "@/components/AppImage";
import Button from "@/components/Button";
import { authClient } from "@/lib/auth-client";

interface AccountSidebarProps {
  activeTab: string;
  user: Session["user"];
}

export function AccountSidebar({ activeTab, user }: AccountSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/account" },
    { id: "orders", label: "Orders", icon: Package, path: "/account/orders" },
    { id: "wishlist", label: "Wishlist", icon: Heart, path: "/account/wishlist" },
    { id: "reviews", label: "My Reviews", icon: MessageSquare, path: "/account/reviews" },
    { id: "addresses", label: "Addresses", icon: MapPin, path: "/account/addresses" },
    { id: "payment", label: "Payment", icon: CreditCard, path: "/account/payment" },
    { id: "settings", label: "Settings", icon: Settings, path: "/account/settings" },
  ];

  return (
    <aside className="w-full shrink-0 space-y-8 md:w-72">
      <div className="flex items-center gap-4 px-2">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
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
          <p className="max-w-[150px] truncate text-gray-500 text-xs">{user.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={{ pathname: item.path }}
            className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
              activeTab === item.id ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-white"
            }`}
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

      <div className="pt-8 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-red-200 text-red-500 hover:bg-red-50"
        >
          <LogOut size={16} className="mr-2" />{" "}
          Sign Out
        </Button>
      </div>
    </aside>
  );
}