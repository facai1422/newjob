import React from 'react';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-black/60 rounded-md animate-pulse ${className}`} />
  );
}

export function SkeletonLine({ className = '' }: SkeletonProps) {
  return (
    <div className={`h-4 bg-black/60 rounded ${className}`} />
  );
}

export function SkeletonAvatar({ className = '' }: SkeletonProps) {
  return (
    <div className={`size-10 rounded-full bg-black/60 animate-pulse ${className}`} />
  );
}


