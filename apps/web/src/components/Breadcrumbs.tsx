"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs: React.FC = () => {
  const location = usePathname();
  const pathnames = location.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="no-scrollbar mb-6 flex animate-fade-in items-center overflow-x-auto whitespace-nowrap text-gray-500 text-sm">
      <Link
        href="/"
        className="flex items-center transition-colors hover:text-black"
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
                className="transition-colors hover:text-black"
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
