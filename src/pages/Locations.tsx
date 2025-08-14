import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GeometricBackground } from '@/components/ui/geometric-background';
import { RevealText } from '@/components/ui/reveal-text';
import { LazyMount } from '@/components/ui/lazy-mount';
import { supabase } from '@/lib/supabase';
import MinimalistDock from '@/components/ui/minimal-dock';

interface JobLocation {
  id: number;
  nameKey: string;
  image: string;
  jobCount: number;
}

export default function Locations() {
  const { t } = useLanguage();

  const [jobLocations, setJobLocations] = React.useState<JobLocation[]>([
    { id: 1, nameKey: 'locations.ghana', image: 'https://cy-747263170.imgix.net/%E5%8A%A0%E7%BA%B3.png', jobCount: 0 },
    { id: 2, nameKey: 'locations.cambodia', image: 'https://cy-747263170.imgix.net/%E6%9F%AC%E5%9F%94%E5%AF%A8.png', jobCount: 0 },
    { id: 3, nameKey: 'locations.malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80', jobCount: 0 },
    { id: 4, nameKey: 'locations.indonesia', image: 'https://cy-747263170.imgix.net/%E5%8D%B0%E5%BA%A6%E5%B0%BC%E8%A5%BF%E4%BA%9A.png', jobCount: 0 },
    { id: 5, nameKey: 'locations.myanmar', image: 'https://cy-747263170.imgix.net/%E7%BC%85%E7%94%B8.png', jobCount: 0 },
    { id: 6, nameKey: 'locations.dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', jobCount: 0 },
    { id: 7, nameKey: 'locations.oman', image: 'https://cy-747263170.imgix.net/%E9%98%BF%E6%9B%BC.png', jobCount: 0 },
    { id: 8, nameKey: 'locations.philippines', image: 'https://cy-747263170.imgix.net/%E8%8F%B2%E5%BE%8B%E5%AE%BE.png', jobCount: 0 },
  ]);

  React.useEffect(() => {
    const fetchJobCounts = async () => {
      try {
        const { data } = await supabase
          .from('location_infos')
          .select('location_key,vacancy_count');

        const counts: Record<string, number> = {};
        (data || []).forEach((row: any) => {
          counts[row.location_key] = row.vacancy_count || 0;
        });

        setJobLocations((prev) => prev.map((loc) => ({
          ...loc,
          jobCount: counts[t(loc.nameKey)] || loc.jobCount,
        })));
      } catch (error) {
        // 忽略错误，保持默认 0
      }
    };
    void fetchJobCounts();
  }, [t]);

  return (
    <div className="relative min-h-screen">
      <GeometricBackground />
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-center">
            <RevealText
              text={t('locations.title')}
              textColor="text-white"
              overlayColor="text-indigo-400"
              fontSize="text-2xl md:text-4xl"
              letterDelay={0.06}
              overlayDelay={0.04}
              overlayDuration={0.35}
              springDuration={500}
            />
          </div>

          <div className="flex flex-col gap-6 [content-visibility:auto] [contain-intrinsic-size:1px_700px]">
            {jobLocations.map((location) => (
              <LazyMount
                key={location.id}
                height="264px"
                fallback={
                  <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                    <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900">
                      <div className="h-64 w-full bg-black/60 animate-pulse relative">
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                          <div className="h-6 bg-white/20 rounded w-1/2 animate-pulse" />
                          <div className="h-4 bg-white/15 rounded w-1/3 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                  <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900">
                    <Link
                      to={`/jobs/location/${encodeURIComponent(t(location.nameKey))}`}
                      className="block h-64 w-full relative group"
                      aria-label={`View jobs in ${t(location.nameKey)}`}
                    >
                      <img
                        src={location.image}
                        alt={t(location.nameKey)}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{t(location.nameKey)}</h3>
                        <div className="flex items-center text-white/90">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{location.jobCount} {t('locations.openings')}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </LazyMount>
            ))}
          </div>
        </div>
      </section>
      <MinimalistDock />
    </div>
  );
}


