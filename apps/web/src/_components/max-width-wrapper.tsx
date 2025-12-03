// src/_components/max-width-wrapper.tsx
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';


const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-screen-xl h-full px-2.5 md:px-20 bg-background rounded-3xl p-4 md:p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;