import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const Component = () => {
  const [images, setImages] = useState<string[]>([]);
  const duplicatedImages = useMemo(() => (images.length ? [...images, ...images] : []), [images]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('carousel_items')
          .select('src,is_active,sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!mounted) return;
        if (error) {
          setImages([]);
          return;
        }
        setImages((data || []).map((d: any) => d.src).filter(Boolean));
      } catch {
        if (!mounted) return;
        setImages([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 20s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            white 10%,
            white 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            white 10%,
            white 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      {duplicatedImages.length === 0 ? null : (
      <div className="w-full relative overflow-hidden flex items-center justify-center">
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center py-8">
          <div className="scroll-container w-full max-w-6xl">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${images.length ? (index % images.length) + 1 : index + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    loading="lazy"
                    decoding="async"
                    style={{
                      backgroundColor: '#333',
                      backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23333'/%3e%3c/svg%3e")`,
                      backgroundSize: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};
