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
          {addresses?.data.map((addr) => (
            <BentoCard
              key={addr.id}
              className={`p-6 bg-white border-2 relative ${addr.isDefault ? "border-black" : "border-transparent"}`}
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-black text-white px-2 py-1 rounded-full">
                  DEFAULT
                </span>
              )}
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
            className="p-6 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center min-h-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setIsAddressModalOpen(true)}
          >
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-white mx-auto mb-2 flex items-center justify-center shadow-sm">
                +
              </div>
              <span className="font-bold text-sm text-gray-500">Add Address</span>
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
