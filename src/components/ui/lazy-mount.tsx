import React from 'react';
import { Skeleton } from './skeleton';

type LazyMountProps = {
  children: React.ReactNode;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  height?: string | number;
  skeleton?: boolean;
  priority?: boolean;
};

export function LazyMount({ 
  children, 
  rootMargin = '200px', 
  once = true, 
  className = '',
  fallback,
  height,
  skeleton = true,
  priority = false
}: LazyMountProps) {
  const [visible, setVisible] = React.useState(priority);
  const [isLoading, setIsLoading] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (priority) {
      setIsLoading(false);
      return;
    }
    
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Small delay to prevent flash
          const timer = setTimeout(() => setIsLoading(false), 50);
          if (once) observer.disconnect();
          return () => clearTimeout(timer);
        } else if (!once) {
          setVisible(false);
          setIsLoading(true);
        }
      },
      { rootMargin }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once, priority]);

  // Default skeleton fallback
  const getDefaultSkeleton = () => {
    const skeletonHeight = height || '200px';
    return (
      <div className="space-y-4" style={{ height: skeletonHeight }}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  };

  const renderContent = () => {
    if (!visible) {
      if (fallback) return fallback;
      if (skeleton) return getDefaultSkeleton();
      return null;
    }

    if (isLoading && skeleton) {
      return (
        <div className="relative">
          <div className="opacity-0 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0">
            {fallback || getDefaultSkeleton()}
          </div>
        </div>
      );
    }

    return children;
  };

  const containerStyle = height ? { minHeight: height } : {};

  return (
    <div 
      ref={ref} 
      className={className}
      style={containerStyle}
    >
      {renderContent()}
    </div>
  );
}


