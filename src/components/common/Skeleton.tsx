import React from 'react';
import { cn } from './Card';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('skeleton rounded-md w-full h-full', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
