import React from 'react';

type SkeletonProps = {
  className?: string;
  animate?: boolean;
  variant?: 'default' | 'shimmer' | 'wave';
};

const getSkeletonClasses = (variant: string, animate: boolean) => {
  const base = 'bg-black/60 rounded-md';
  const animationClass = animate ? 'animate-pulse' : '';
  
  switch (variant) {
    case 'shimmer':
      return `${base} relative overflow-hidden ${animationClass} before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;
    case 'wave':
      return `${base} bg-gradient-to-r from-black/60 via-black/40 to-black/60 bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite]`;
    default:
      return `${base} ${animationClass}`;
  }
};

export function Skeleton({ className = '', animate = true, variant = 'default' }: SkeletonProps) {
  return (
    <div className={`${getSkeletonClasses(variant, animate)} ${className}`} />
  );
}

export function SkeletonLine({ className = '', animate = true, variant = 'default' }: SkeletonProps) {
  return (
    <div className={`h-4 ${getSkeletonClasses(variant, animate)} ${className}`} />
  );
}

export function SkeletonAvatar({ className = '', animate = true, variant = 'default' }: SkeletonProps) {
  return (
    <div className={`size-10 rounded-full ${getSkeletonClasses(variant, animate)} ${className}`} />
  );
}

// 专用骨架屏组件
export function SkeletonCard({ className = '', animate = true }: SkeletonProps) {
  return (
    <div className={`p-4 space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <SkeletonAvatar animate={animate} />
        <div className="space-y-2 flex-1">
          <SkeletonLine className="h-4 w-3/4" animate={animate} />
          <SkeletonLine className="h-3 w-1/2" animate={animate} />
        </div>
      </div>
      <Skeleton className="h-32 w-full" animate={animate} />
      <div className="space-y-2">
        <SkeletonLine className="h-3 w-full" animate={animate} />
        <SkeletonLine className="h-3 w-4/5" animate={animate} />
        <SkeletonLine className="h-3 w-3/5" animate={animate} />
      </div>
    </div>
  );
}

export function SkeletonJobCard({ className = '', animate = true }: SkeletonProps) {
  return (
    <div className={`border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 p-4 md:p-6">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-16 w-16 rounded-lg" animate={animate} />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-6 w-3/4" animate={animate} />
            <SkeletonLine className="h-4 w-1/2" animate={animate} />
            <SkeletonLine className="h-4 w-1/3" animate={animate} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonLine className="h-3 w-full" animate={animate} />
          <SkeletonLine className="h-3 w-4/5" animate={animate} />
          <SkeletonLine className="h-3 w-3/5" animate={animate} />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Skeleton className="h-8 w-24 rounded-full" animate={animate} />
          <Skeleton className="h-8 w-20 rounded" animate={animate} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLocationCard({ className = '', animate = true }: SkeletonProps) {
  return (
    <div className={`border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900">
        <Skeleton className="h-64 w-full" animate={animate} />
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <SkeletonLine className="h-6 w-1/2" animate={animate} />
          <SkeletonLine className="h-4 w-1/3" animate={animate} />
        </div>
      </div>
    </div>
  );
}


