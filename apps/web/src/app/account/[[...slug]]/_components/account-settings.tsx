"use client";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";

interface AccountSettingsProps {
  user: { name: string; email: string; image?: string | null };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="mb-6 font-light text-3xl">Account Settings</h2>
      <BentoCard className="max-w-2xl bg-white p-8">
        <h3 className="mb-6 font-bold">Personal Information</h3>
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
              First Name
            </label>
            <input
              type="text"
              defaultValue={user.name.split(" ")[0]}
              className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={user.name.split(" ")[1] || ""}
              className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div className="mb-8">
          <label className="mb-2 block font-bold text-gray-500 text-xs uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm"
          />
        </div>
        <Button>Save Changes</Button>
      </BentoCard>
    </div>
  );
}
