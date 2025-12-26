"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

import { ChevronRight, Home } from "lucide-react";

import { PRODUCTS } from "../constants";

const Breadcrumbs: React.FC = () => {
  const location = usePathname();
  const pathnames = location.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 animate-fade-in overflow-x-auto no-scrollbar whitespace-nowrap">
      <Link
        href="/"
        className="hover:text-black flex items-center transition-colors"
      >
        <Home
          size={14}
          className="mr-1"
        />{" "}
        Home
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        // Resolve Product Name if ID is in URL
        let displayName = value.replace(/-/g, " ");
        const productMatch = PRODUCTS.find((p) => p.id === value);
        if (productMatch) displayName = productMatch.name;

        // Capitalize first letter
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

        return (
          <div
            key={to}
            className="flex items-center"
          >
            <ChevronRight
              size={14}
              className="mx-2 text-gray-300"
            />
            {isLast ? (
              <span className="font-medium text-black">{displayName}</span>
            ) : (
              <Link
                href={{
                  pathname: to,
                }}
                className="hover:text-black transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
