import type React from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        `relative overflow-hidden rounded-bento bg-nest-card shadow-sm transition-all duration-500 ease-out ${hoverEffect ? "hover:-translate-y-1 hover:shadow-lg" : ""}
      `,
        className,
      )}
      {...props}>
      {children}
    </div>
  );
};

export default BentoCard;
