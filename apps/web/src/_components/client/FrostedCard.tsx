import React from "react";

import { Card } from "@comp/card";

import { cn } from "@/lib/utils";

interface FrostedCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  children: React.ReactNode;
}

export const FrostedCard = React.forwardRef<HTMLDivElement, FrostedCardProps>(({ children, className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("rounded-3xl border-gray-200/20 bg-white/5 text-white shadow-xl backdrop-blur-sm", className)}
    {...props}
  >
    {children}
  </Card>
));

FrostedCard.displayName = "FrostedCard";

export default FrostedCard;
