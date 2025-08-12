import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const ImageAutoSlider: React.FC<Props> = ({ className }) => {
  const images = [
    'https://cy-747263170.imgix.net/4524242452.png',
    'https://cy-747263170.imgix.net/缅甸.png',
    'https://cy-747263170.imgix.net/7455775.png',
    'https://cy-747263170.imgix.net/213213123.png',
    'https://cy-747263170.imgix.net/%E6%97%A5%E6%9C%AC.png',
    'https://cy-747263170.imgix.net/%E7%BE%8E%E5%9B%BD.png',
    'https://cy-747263170.imgix.net/%E6%9F%AC%E5%9F%94%E5%AF%A8.png',
    'https://cy-747263170.imgix.net/%E5%8D%B0%E5%BA%A6%E5%B0%BC%E8%A5%BF%E4%BA%9A.png',
  ];

  const duplicatedImages = [...images, ...images];

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


