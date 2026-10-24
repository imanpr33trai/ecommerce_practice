"use client";

import { useState } from "react";

import { Skeleton } from "@workspace/ui/components/skeleton";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { AddressForm } from "@/components/features/account/AddressForm";
import { useAddressMutations } from "@/data/account/use-address-mutations";
import { useUserAddressQuery } from "@/data/account/use-user-address";
import type { AddressData } from "@/data/account/use-user-address";

export function AccountAddresses() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{
    id: string;
    label?: string;
    firstName: string;
    lastName: string;
    streetLine1: string;
    streetLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  } | null>(null);

const { data: addresses = [], isLoading: addressLoading } = useUserAddressQuery() as { data: AddressData[]; isLoading: boolean };
const { delete: deleteAddress, setDefault } = useAddressMutations();

  const handleEdit = (addr: AddressData) => {
    const nameParts = addr.fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");
    setEditingAddress({
      id: addr.id,
      firstName,
      lastName,
      streetLine1: addr.streetLine1,
      streetLine2: addr.streetLine2 ?? "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress.mutate({ id });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefault.mutate({ id });
  };

  const handleCloseModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-light text-3xl">Saved Addresses</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditingAddress(null);
            setIsAddressModalOpen(true);
          }}
        >
          Add New
        </Button>
      </div>

      {addressLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addresses.map((addr) => (
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
                {addr.streetLine1} {addr.streetLine2 && `${addr.streetLine2} `}<br />
                {addr.city}, {addr.state} {addr.postalCode} <br />
                {addr.country}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="font-bold text-xs underline"
                  onClick={() => handleEdit(addr)}
                  type="button"
                >
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    className="font-bold text-blue-500 text-xs underline"
                    onClick={() => handleSetDefault(addr.id)}
                    type="button"
                  >
                    Set Default
                  </button>
                )}
                <button
                  className="font-bold text-red-500 text-xs underline"
                  onClick={() => handleDelete(addr.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </BentoCard>
          ))}

          <BentoCard
            className="flex min-h-50 cursor-pointer items-center justify-center border border-gray-300 border-dashed bg-gray-50 p-6 transition-colors hover:bg-gray-100"
            onClick={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
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

      <AddressForm
        initialData={editingAddress || undefined}
        editingAddressId={editingAddress?.id}
        isOpen={isAddressModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}