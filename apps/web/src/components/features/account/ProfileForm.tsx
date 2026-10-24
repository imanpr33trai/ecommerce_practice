"use client";

import { useState } from "react";

import { useUpdateProfileMutation } from "@/data/account";
import type { GetUpdateProfileRequest } from "@/data/account/types";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
  });

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData as GetUpdateProfileRequest);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.name.split(" ")[0]}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
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
            value={formData.name.split(" ").slice(1).join(" ")}
            onChange={handleChange}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
            disabled={isPending}
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
          disabled={isPending}
        />
      </div>
      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}