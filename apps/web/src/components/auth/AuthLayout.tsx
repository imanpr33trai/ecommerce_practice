"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
  logoHref?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  footer,
  logoHref = "/",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nest-bg p-4">
      <div className="mb-8">
        <Link
          href={logoHref}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-sm"
        >
          <div className="grid h-6 w-6 place-items-center rounded-full bg-black">
            <span className="font-bold text-white text-xs">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Nestify</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-light text-3xl">{title}</h1>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-gray-500 text-sm">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}