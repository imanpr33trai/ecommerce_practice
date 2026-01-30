"use client";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";

interface AccountSettingsProps {
  user: { name: string; email: string; image?: string | null };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-light mb-6">Account Settings</h2>
      <BentoCard className="p-8 bg-white max-w-2xl">
        <h3 className="font-bold mb-6">Personal Information</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue={user.name.split(" ")[0]}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={user.name.split(" ")[1] || ""}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm"
            />
          </div>
        </div>
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm"
          />
        </div>
        <Button>Save Changes</Button>
      </BentoCard>
    </div>
  );
}
