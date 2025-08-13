import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ScrollTiltCard } from '@/components/ui/scroll-tilt-card';

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
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/80">Loading...</div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <ScrollTiltCard key={job.id}>
                <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                  <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-4">
                  {(() => {
                    const first = (job.image_urls && job.image_urls.length > 0) ? job.image_urls[0] : job.image_url;
                    return first ? (
                      <img src={first} alt={job.title} className="w-full h-44 object-cover rounded-lg mb-4" />
                    ) : null;
                  })()}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{job.title}</h3>
                      <p className="text-white/80">{job.salary}</p>
                    </div>
                  </div>
                  <p className="text-white/70 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    {job.working_hours}
                  </p>
                    <Link to={`/jobs/${job.id}`} className="mt-4 w-full bg-white/10 text-white py-2 rounded flex items-center justify-center hover:bg-white/20 border border-white/10">
                    {t('featured.viewDetails')}
                  </Link>
                  </div>
                </div>
              </ScrollTiltCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/80">No jobs found in {location}</div>
        )}
      </div>
    </div>
  );
}