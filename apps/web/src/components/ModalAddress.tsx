import type React from "react";

import { X } from "lucide-react";

import Button from "./Button";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddress: React.FC<ModalAddressProps> = ({ isOpen, onClose }) => {
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
          <h3 className="font-bold text-xl">Add New Address</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6 md:p-8">
          <div>
            <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
              Address Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Home, Work"
              className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
              Street Address
            </label>
            <input
              type="text"
              placeholder="123 Main St"
              className="mb-2 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
            <input
              type="text"
              placeholder="Apt, Suite, Unit (Optional)"
              className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                State / Province
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                Zip / Postal Code
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
                Country
              </label>
              <select className="w-full appearance-none rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Germany</option>
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 pt-2">
            <input type="checkbox" className="h-4 w-4 rounded accent-black" />
            <span className="font-medium text-gray-600 text-sm">Set as default address</span>
          </label>
        </div>

        <div className="flex gap-3 border-gray-100 border-t bg-gray-50 p-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Save Address
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddress;
