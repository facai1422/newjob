import React, { useState, useRef, useEffect } from 'react';

interface ImageWithPlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  fallbackColor?: string;
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageWithPlaceholder({
  src,
  alt,
  placeholderSrc,
  fallbackColor = '#1a1a1a',
  blurDataURL,
  priority = false,
  className = '',
  onLoad,
  onError,
  ...props
}: ImageWithPlaceholderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;
    
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Generate placeholder from first letter for fallback
  const getInitialPlaceholder = () => {
    const letter = alt.charAt(0).toUpperCase() || '?';
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center text-white/60 font-bold text-2xl"
        style={{ backgroundColor: fallbackColor }}
      >
        {letter}
      </div>
    );
  };

  const getBlurPlaceholder = () => {
    if (blurDataURL) {
      return (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          style={{ filter: 'blur(8px)' }}
        />
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Base placeholder */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"
        style={{ backgroundColor: fallbackColor }}
      />

      {/* Blur placeholder */}
      {getBlurPlaceholder()}

      {/* Custom placeholder image */}
      {placeholderSrc && !loaded && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      )}

      {/* Initial letter placeholder as last resort */}
      {!placeholderSrc && !blurDataURL && getInitialPlaceholder()}

      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`relative w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'low'}
          {...props}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/60">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Loading indicator */}
      {isInView && !loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// 预设一些常用的模糊占位符
export const IMAGE_PLACEHOLDERS = {
  hero: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxOTIwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMTExMTEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzMzMzMzIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iNTAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+Cjwvc3ZnPgo=',
  card: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE5MWExYSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyZjJmMmYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNncmFkMikiLz4KPC9zdmc+Cg==',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0yMCA4MEMzMCA2MCA3MCA2MCA4MCA4MEg2MEMzMCA4MCAyMCA4MCAyMCA4MFoiIGZpbGw9IiM2NjY2NjYiLz4KPC9zdmc+Cg=='
};
