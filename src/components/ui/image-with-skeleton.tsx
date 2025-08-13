import React from 'react';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
};

export function ImageWithSkeleton({ src, alt = '', className = '', imgClassName = '' }: Props) {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />
      )}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}


