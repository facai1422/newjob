interface GoogleIconProps {
  size?: number;
  className?: string;
}

export function GoogleIcon({ size = 20, className = "" }: GoogleIconProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // 如果图标加载失败，显示备用的G字母
    const target = e.target as HTMLImageElement;
    target.classList.add('hidden');
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove('hidden');
      fallback.classList.add('inline-flex');
    }
  };

  return (
    <img 
      src="https://cy-747263170.imgix.net/icon48.png"
      alt="Google"
      width={size}
      height={size}
      className={`inline-block object-contain ${className}`}
      loading="lazy"
      onError={handleError}
    />
  );
}

export function GoogleIconFallback({ size = 20, className = "" }: GoogleIconProps) {
  const sizeClass = size <= 16 ? 'w-4 h-4 text-xs' : size <= 20 ? 'w-5 h-5 text-sm' : 'w-6 h-6 text-base';
  
  return (
    <span 
      className={`hidden items-center justify-center font-bold text-gray-600 ${sizeClass} ${className}`}
    >
      G
    </span>
  );
}
