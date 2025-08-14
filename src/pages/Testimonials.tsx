import React from 'react';
import { GeometricBackground } from '@/components/ui/geometric-background';
import DemoTestimonials3D from '@/components/ui/demo-3d-testimonials';
import MinimalistDock from '@/components/ui/minimal-dock';

export default function Testimonials() {
  return (
    <div className="relative min-h-screen">
      <GeometricBackground />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">What Candidates Say</h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Real stories from job seekers who used Hirely to discover exciting opportunities and submit resumes effortlessly.
          </p>
        </div>
        <div className="flex justify-center">
          <DemoTestimonials3D />
        </div>
      </div>
      <MinimalistDock />
    </div>
  );
}


