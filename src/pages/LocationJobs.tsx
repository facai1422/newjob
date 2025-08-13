import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ScrollTiltCard } from '@/components/ui/scroll-tilt-card';
import { WorldMap } from '@/components/ui/world-map';
import { Skeleton, SkeletonLine } from '@/components/ui/skeleton';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { JobListing } from '@/components/ui/job-listing';

interface Job {
  id: string;
  title: string;
  salary: string;
  description: string;
  working_hours: string;
  image_url?: string;
  image_urls?: string[];
}

export function LocationJobs() {
  const { location } = useParams();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Destination coordinates by location name
  const destinationCoords: Record<string, { lat: number; lng: number }> = {
    Ghana: { lat: 5.6037, lng: -0.187 }, // Accra
    Cambodia: { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
    Malaysia: { lat: 3.139, lng: 101.6869 }, // Kuala Lumpur
    Indonesia: { lat: -6.2088, lng: 106.8456 }, // Jakarta
    Myanmar: { lat: 16.8661, lng: 96.1951 }, // Yangon
    Dubai: { lat: 25.2048, lng: 55.2708 }, // Dubai
    Oman: { lat: 23.588, lng: 58.3829 }, // Muscat
    Philippines: { lat: 14.5995, lng: 120.9842 } // Manila
  };
  
  const globalHubs: Array<{ lat: number; lng: number }> = [
    { lat: 40.7128, lng: -74.006 }, // New York
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 51.5074, lng: -0.1278 }, // London
    { lat: 48.8566, lng: 2.3522 }, // Paris
    { lat: 41.0082, lng: 28.9784 }, // Istanbul
    { lat: 35.6762, lng: 139.6503 } // Tokyo
  ];
  
  const dots = (() => {
    const key = (location || '').toString();
    const dest = destinationCoords[key];
    if (!dest) return [] as Array<{ start: {lat: number; lng: number}; end: {lat: number; lng: number} }>;
    return globalHubs.map((hub) => ({ start: hub, end: dest }));
  })();

  const locationMap: { [key: string]: string } = {
    'Ghana': '加纳',
    'Cambodia': '柬埔寨',
    'Malaysia': '马来西亚',
    'Indonesia': '印度尼西亚',
    'Myanmar': '缅甸',
    'Dubai': '迪拜',
    'Oman': '阿曼',
    'Philippines': '菲律宾'
  };

  useEffect(() => {
    fetchLocationJobs();
  }, [location]);

  const fetchLocationJobs = async () => {
    try {
      const english = (location || '').toString();
      const chinese = locationMap[english] || english;
      const candidates = Array.from(new Set([english, chinese]));
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('location', candidates)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* 星空与流星背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_70%)]" />
        <ShootingStars starColor="#9E00FF" trailColor="#2EB9DF" minSpeed={15} maxSpeed={35} minDelay={1000} maxDelay={3000} />
        <ShootingStars starColor="#FF0099" trailColor="#FFB800" minSpeed={10} maxSpeed={25} minDelay={2000} maxDelay={4000} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 text-white">
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('nav.back')}
        </Link>

        <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl mb-8">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-6">
            <div className="flex items-center space-x-2 text-white/90">
              <MapPin className="h-5 w-5" />
              <h1 className="text-2xl font-bold">{location}</h1>
            </div>
            <div className="mt-6">
              <WorldMap lineColor="#0ea5e9" dots={dots as any} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [content-visibility:auto] [contain-intrinsic-size:1px_600px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-4">
                  <Skeleton className="w-full h-44 rounded-lg mb-4" />
                  <div className="space-y-2">
                    <SkeletonLine className="w-2/3" />
                    <SkeletonLine className="w-1/3" />
                  </div>
                  <Skeleton className="mt-4 h-10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <JobListing
            jobs={jobs.map((j) => {
              const meta: any = (j as any).rich_description || {};
              return {
                id: j.id,
                title: j.title,
                company: meta.company || '',
                location: (location as string) || '',
                salary: j.salary,
                type: meta.type || 'Full Time',
                openings: meta.openings || 1,
                description: j.description,
                requirements: meta.requirements || [],
                benefits: meta.benefits || [],
                rewards: meta.rewards || [],
                imageUrl: (j.image_urls && j.image_urls[0]) || j.image_url,
                postedDate: meta.postedDate || '',
                companyLogo: meta.companyLogo || ''
              };
            })}
          />
        ) : (
          <div className="text-center py-12 text-white/80">No jobs found in {location}</div>
        )}
      </div>
    </div>
  );
}