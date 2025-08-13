import React from 'react';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-white/10 rounded-md animate-pulse ${className}`} />
  );
}

export function SkeletonLine({ className = '' }: SkeletonProps) {
  return (
    <div className={`h-4 bg-white/10 rounded ${className}`} />
  );
}

export function SkeletonAvatar({ className = '' }: SkeletonProps) {
  return (
    <div className={`size-10 rounded-full bg-white/10 animate-pulse ${className}`} />
  );
}


