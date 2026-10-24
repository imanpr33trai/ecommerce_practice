"use client";

import { useState } from "react";

import BentoCard from "@/components/BentoCard";
import Button from "@/components/Button";
import { ProfileForm } from "@/components/features/account/ProfileForm";
import { useUserProfileQuery } from "@/data/account/use-user-profile";
import type { ProfileData } from "@/data/account/use-user-profile";

interface AccountSettingsProps {
  user: { name: string; email: string; image?: string | null };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const { data: profile } = useUserProfileQuery() as { data: ProfileData | undefined };

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="mb-6 font-light text-3xl">Account Settings</h2>
      <BentoCard className="max-w-2xl bg-white p-8">
        <h3 className="mb-6 font-bold">Personal Information</h3>
        <ProfileForm
          initialData={{
            name: profile?.name || user.name,
            email: profile?.email || user.email,
          }}
        />
      </BentoCard>
    </div>
  );
}