import React from 'react';
import { testimonials, TestimonialCard } from '@/components/ui/demo-3d-testimonials';
import { Marquee } from '@/components/ui/3d-testimonails';

// 斜向滚动背景：通过两组水平与垂直位移组合形成右上 ↔ 左下的视觉效果
// 核心：容器整体倾斜 + 内容在两个方向上同时滚动

export default function DiagonalTestimonialsBG() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* 倾斜容器，带有轻微的 3D 透视 */}
      <div className="absolute inset-[-10%] [perspective:600px] [transform:rotate(-12deg)_skewY(-6deg)]">
        <div className="flex gap-8">
          {/* 第一列：向右上滚动（通过纵向向上 + 横向向右的组合） */}
          <div className="flex-1">
            <div className="relative h-[140vh] -translate-x-20">
              <Marquee vertical pauseOnHover={false} repeat={4} className="[--duration:35s]">
                {testimonials.map((review) => (
                  <div key={review.username} className="translate-x-8">
                    <TestimonialCard {...review} />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>

          {/* 第二列：向左下滚动（反向） */}
          <div className="flex-1">
            <div className="relative h-[140vh] translate-x-10">
              <Marquee vertical reverse pauseOnHover={false} repeat={4} className="[--duration:38s]">
                {testimonials.map((review) => (
                  <div key={review.username} className="-translate-x-8">
                    <TestimonialCard {...review} />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </div>

      {/* 叠加渐变以提升可读性 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
}


