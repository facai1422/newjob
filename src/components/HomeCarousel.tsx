import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { supabase } from '../lib/supabase';

interface CarouselItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

export function HomeCarousel() {
  const [items, setItems] = React.useState<CarouselItem[]>([]);

  React.useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('carousel_items')
        .select('id,type,src,alt,sort_order,is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      setItems(
        (data || []).map((d: any) => ({ id: d.id, type: d.type, src: d.src, alt: d.alt }))
      );
    })();
  }, []);

  const fallback: CarouselItem[] = [
    { id: '1', type: 'image', src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80', alt: 'Hero' }
  ];

  const list = items.length ? items : fallback;

  return (
    <div className="relative w-full h-[300px] md:h-[500px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {list.map((item) => (
          <SwiperSlide key={item.id} className="relative">
            {item.type === 'image' ? (
              <img src={item.src} alt={item.alt || ''} className="w-full h-full object-cover" />
            ) : (
              <iframe
                src={item.src}
                title={item.alt || 'video'}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                frameBorder="0"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}