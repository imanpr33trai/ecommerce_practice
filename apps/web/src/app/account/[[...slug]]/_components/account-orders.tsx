"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { useOrderListQuery } from "@/data/order";
import { formatCurrency } from "@/lib/format-currency";

export function AccountOrders() {
  const router = useRouter();

  const { data: orders, isLoading: ordersLoading } = useOrderListQuery();

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="mb-6 font-light text-3xl">Order History</h2>
      {ordersLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : orders?.data.length === 0 ? (
        <div className="text-gray-500">No orders placed yet.</div>
      ) : (
        <div className="space-y-4">
          {orders?.data.map((order) => (
            <BentoCard
              key={order.id}
              className="flex flex-col items-center gap-6 bg-white p-6 md:flex-row">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-gray-100">
                <Package className="text-gray-400" />
              </div>
              <div className="w-full flex-1 text-center md:text-left">
                <div className="mb-1 flex items-center justify-between">
                  {/*<h4 className="font-bold text-lg">Order #{order.id.slice(-6)}</h4>*/}
                  {order.items.map((item) => (
                    <h4 className="font-bold text-lg" key={item.id}>
                      Order #{item.product.name}
                    </h4>
                  ))}
                  <span
                    className={`rounded-full px-2 py-1 font-bold text-xs ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mb-2 text-gray-500 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{formatCurrency(Number(order.totalAmount))}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>{order.items.length} Items</span>
                </div>
              </div>
              <Button variant="secondary" onClick={() => router.push("/product")}>
                View Details
              </Button>
            </BentoCard>
          ))}
        </div>
      )}
    </div>
  );
}
