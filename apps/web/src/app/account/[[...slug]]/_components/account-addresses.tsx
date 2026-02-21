"use client";

import { useState } from "react";

import { Skeleton } from "@workspace/ui/components/skeleton";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import ModalAddress from "@/components/ModalAddress";
import { useAddressDeleteMutation } from "@/data/account/use-delete-address";
import { useUserAddressQuery } from "@/data/account/use-user-address";

export function AccountAddresses() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { data: addresses, isLoading: addressLoading } = useUserAddressQuery();
  const { mutate: deleteAddress } = useAddressDeleteMutation();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-light text-3xl">Saved Addresses</h2>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addresses?.data.map((addr) => (
            <BentoCard
              key={addr.id}
              className={`relative border-2 bg-white p-6 ${addr.isDefault ? "border-black" : "border-transparent"}`}
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 rounded-full bg-black px-2 py-1 font-bold text-[10px] text-white">
                  DEFAULT
                </span>
              )}
              <h3 className="mb-2 font-bold">{addr.fullName}</h3>
              <p className="mb-4 text-gray-600 text-sm leading-relaxed">
                {addr.streetLine1} {addr.streetLine2} <br />
                {addr.city}, {addr.state} {addr.postalCode} <br />
                {addr.country}
              </p>
              <div className="flex gap-2">
                <button
                  className="font-bold text-xs underline"
                  onClick={() => {
                    /* Edit Logic */
                  }}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="font-bold text-red-500 text-xs underline"
                  onClick={() => deleteAddress({ id: addr.id })}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </BentoCard>
          ))}

          <BentoCard
            className="flex min-h-50 cursor-pointer items-center justify-center border border-gray-300 border-dashed bg-gray-50 p-6 transition-colors hover:bg-gray-100"
            onClick={() => setIsAddressModalOpen(true)}
          >
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                +
              </div>
              <span className="font-bold text-gray-500 text-sm">Add Address</span>
            </div>
          </BentoCard>
        </div>
      )}

      <ModalAddress
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}
