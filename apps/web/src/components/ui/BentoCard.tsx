import { cn } from "@/lib/utils";
import React from "react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = "",
  hoverEffect = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-nest-card rounded-bento overflow-hidden relative shadow-sm transition-all duration-500 ease-out",
        className,
        hoverEffect ? "hover:shadow-lg hover:-translate-y-1" : ""
      )}
    >
      {children}
    </div>
  );
};

export default BentoCard;
