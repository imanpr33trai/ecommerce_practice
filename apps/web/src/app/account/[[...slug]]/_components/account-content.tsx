"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { Bell, ChevronRight, CreditCard, Heart, LayoutDashboard, LogOut, MapPin, Package, Settings } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import ModalAddress from "@/components/ModalAddress"; // Your Modal
import { Account } from "@/feature/account"; // Feature hooks
import { Order } from "@/feature/order";
import { authClient } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/format-currency";

interface Props {
  activeTab: string;
  user: { name: string; email: string; image?: string | null };
}

export function AccountContent({ activeTab, user }: Props) {
  const router = useRouter();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // --- HOOKS ---
  const { data: profile } = Account.hooks.useProfile(); // Contains stats
  const { data: orders, isLoading: ordersLoading, error, isError } = Order.hooks.useList();
  const { data: addresses, isLoading: addressLoading } = Account.hooks.useAddresses();
  const { mutate: deleteAddress } = Account.hooks.useDeleteAddress();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/account" },
    { id: "orders", label: "Orders", icon: Package, path: "/account/orders" },
    { id: "addresses", label: "Addresses", icon: MapPin, path: "/account/addresses" },
    { id: "payment", label: "Payment", icon: CreditCard, path: "/account/payment" },
    { id: "settings", label: "Settings", icon: Settings, path: "/account/settings" },
  ];

  // --- CONTENT RENDERERS ---

  const renderOverview = () => {
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
              {/* Added safe optional chaining for profile */}
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
            <div className="p-6 rounded-3xl border border-dashed border-gray-300 text-center text-gray-500 text-sm">No orders placed yet.</div>
          ) : (
            <BentoCard className="p-6 bg-white">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">{recentOrder.items.length} Items</div>
                  <div>
                    <h4 className="font-bold">Order #{recentOrder.id.slice(-6)}</h4>
                    <p className="text-sm text-gray-500">{new Date(recentOrder.createdAt).toLocaleDateString()}</p>
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
  };
  const renderOrders = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-light mb-6">Order History</h2>
      {ordersLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : orders?.length === 0 ? (
        <div className="text-gray-500">No orders placed yet.</div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <BentoCard
              key={order.id}
              className="p-6 bg-white flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 grid place-items-center">
                <Package className="text-gray-400" />
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-lg">Order #{order.id.slice(-6)}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{formatCurrency(Number(order.totalAmount))}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{order.items.length} Items</span>
                </div>
              </div>
              <Button variant="secondary">View Details</Button>
            </BentoCard>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-3xl font-light">Saved Addresses</h2>
        <Button
          size="sm"
          onClick={() => setIsAddressModalOpen(true)}
        >
          Add New
        </Button>
      </div>

      {addressLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses?.map((addr) => (
            <BentoCard
              key={addr.id}
              className={`p-6 bg-white border-2 relative ${addr.isDefault ? "border-black" : "border-transparent"}`}
            >
              {addr.isDefault && <span className="absolute top-4 right-4 text-[10px] font-bold bg-black text-white px-2 py-1 rounded-full">DEFAULT</span>}
              <h3 className="font-bold mb-2">{addr.fullName}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {addr.streetLine1} {addr.streetLine2} <br />
                {addr.city}, {addr.state} {addr.postalCode} <br />
                {addr.country}
              </p>
              <div className="flex gap-2">
                <button
                  className="text-xs font-bold underline"
                  onClick={() => {
                    /* Edit Logic */
                  }}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="text-xs font-bold text-red-500 underline"
                  onClick={() => deleteAddress({ id: addr.id })}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </BentoCard>
          ))}

          <BentoCard
            className="p-6 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setIsAddressModalOpen(true)}
          >
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-white mx-auto mb-2 flex items-center justify-center shadow-sm">+</div>
              <span className="font-bold text-sm text-gray-500">Add Address</span>
            </div>
          </BentoCard>
        </div>
      )}
    </div>
  );

  // --- RENDER ---

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
                    className={activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-black"}
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
          {activeTab === "overview" && renderOverview()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "addresses" && renderAddresses()}
          {/* Add other tabs like Settings/Payment */}
        </main>
      </div>

      <ModalAddress
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}
