"use client";

import { useRouter } from "next/navigation";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { Package } from "lucide-react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useOrderListQuery } from "@/data/order";
import { formatCurrency } from "@/lib/format-currency";

export function AccountOrders() {
  const router = useRouter();

  const { data: orders, isLoading: ordersLoading } = useOrderListQuery();

  return (
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
                  {/*<h4 className="font-bold text-lg">Order #{order.id.slice(-6)}</h4>*/}
                  {order.items.map((item) => (
                    <h4
                      className="font-bold text-lg"
                      key={item.id}
                    >
                      Order #{item.product.name}
                    </h4>
                  ))}
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{formatCurrency(Number(order.totalAmount))}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{order.items.length} Items</span>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => router.push("/product")}
              >
                View Details
              </Button>
            </BentoCard>
          ))}
        </div>
      )}
    </div>
  );
}
