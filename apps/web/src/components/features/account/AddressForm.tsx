"use client";

import { useState } from "react";

import { useAddressMutations } from "@/data/account/use-address-mutations";
import type { GetAddAddressRequest, GetUpdateAddressRequest } from "@/data/account/types";

interface AddressFormData {
  label?: string;
  firstName: string;
  lastName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  initialData?: AddressFormData;
  onClose: () => void;
  editingAddressId?: string;
  isOpen?: boolean;
}

export function AddressForm({ initialData, onClose, editingAddressId, isOpen = true }: AddressFormProps) {
  const isEditing = !!editingAddressId;
  const { create, update } = useAddressMutations();
  const isPending = create.isPending || update.isPending;

  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    firstName: "",
    lastName: "",
    streetLine1: "",
    streetLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    isDefault: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const addressData = {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      streetLine1: formData.streetLine1,
      streetLine2: formData.streetLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      isDefault: formData.isDefault,
    };

    if (isEditing && editingAddressId) {
      update.mutate(
        { id: editingAddressId, json: addressData as GetUpdateAddressRequest["json"] },
        { onSuccess: () => onClose() }
      );
    } else {
      create.mutate(
        addressData as GetAddAddressRequest["json"],
        { onSuccess: () => onClose() }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg animate-slide-up overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-gray-100 border-b p-6">
          <h3 className="font-bold text-xl">{isEditing ? "Edit Address" : "Add New Address"}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="label" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
          Address Label (Optional)
        </label>
        <input
          type="text"
          id="label"
          name="label"
          placeholder="e.g. Home, Work"
          value={formData.label || ""}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="streetLine1" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
          Street Address
        </label>
        <input
          type="text"
          id="streetLine1"
          name="streetLine1"
          placeholder="123 Main St"
          value={formData.streetLine1}
          onChange={handleChange}
          className="mb-2 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
          disabled={isPending}
          required
        />
        <input
          type="text"
          id="streetLine2"
          name="streetLine2"
          placeholder="Apt, Suite, Unit (Optional)"
          value={formData.streetLine2 || ""}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
            required
          />
        </div>
        <div>
          <label htmlFor="state" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            State / Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            Zip / Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
            required
          />
        </div>
        <div>
          <label htmlFor="country" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full appearance-none rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 pt-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault || false}
          onChange={handleChange}
          className="h-4 w-4 rounded accent-black disabled:opacity-50"
          disabled={isPending}
        />
        <span className="font-medium text-gray-600 text-sm">Set as default address</span>
      </label>

      <div className="flex gap-3 border-gray-100 border-t bg-gray-50 p-6 mt-4 rounded-b-[2rem]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}