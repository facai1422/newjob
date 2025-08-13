import React from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

type Props = {
  className?: string;
};

export const ImageAutoSlider: React.FC<Props> = ({ className }) => {
  const [images, setImages] = React.useState<string[]>([]);
  const duplicatedImages = React.useMemo(() => [...images, ...images], [images]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('src,is_active,sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (!mounted) return;
      if (error) {
        // 回退：如果表不存在或错误，使用空列表避免崩溃
        setImages([]);
        return;
      }
      setImages((data || []).map((d: any) => d.src).filter(Boolean));
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <style>{`
        @keyframes scroll-right { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .scrolling { animation: scroll-right 24s linear infinite; }
      `}</style>
      <div className={cn('w-full relative overflow-hidden', className)}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-full">
            <div className="scrolling flex gap-8 w-max">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl image-item"
                >
                  <img
                    src={image}
                    alt={`Gallery ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageAutoSlider;


