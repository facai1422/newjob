import React from 'react';
import DemoTestimonials3D from '@/components/ui/demo-3d-testimonials';
import MinimalistDock from '@/components/ui/minimal-dock';

export default function Testimonials() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* 全屏作为背景的 3D 滚动组件 */}
      <DemoTestimonials3D fullscreen />
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">What Candidates Say</h1>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Real stories from job seekers praising a smooth application, helpful guidance, and exciting roles.
        </p>
      </div>
      <MinimalistDock />
    </div>
  );
}


