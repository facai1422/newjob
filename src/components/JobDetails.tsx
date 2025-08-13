import React from 'react';
import { Skeleton, SkeletonLine } from '@/components/ui/skeleton';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';
import { GeometricBackground } from '@/components/ui/geometric-background';

interface Job {
  id: string;
  title: string;
  salary: string;
  description: string;
  working_hours: string;
}

export function JobDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
        <GeometricBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
            <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-6 text-white">
              <SkeletonLine className="w-1/3 h-8 mb-6" />
              <div className="space-y-6">
                <div>
                  <SkeletonLine className="w-1/5 h-5 mb-2" />
                  <SkeletonLine className="w-1/3 h-4" />
                </div>
                <div>
                  <SkeletonLine className="w-1/4 h-5 mb-2" />
                  <Skeleton className="h-24 rounded" />
                </div>
                <div>
                  <SkeletonLine className="w-1/4 h-5 mb-2" />
                  <SkeletonLine className="w-1/3 h-4" />
                </div>
                <Skeleton className="h-12 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
        <GeometricBackground />
        <div className="relative z-10 container mx-auto px-4 py-8 text-white/80">Job not found</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
      <GeometricBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('nav.back')}
        </Link>

        <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-2">{t('job.salary')}</h2>
                <p className="text-white/80">{job.salary}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-2">{t('job.description')}</h2>
                <p className="text-white/80 whitespace-pre-line">{job.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white/80 mb-2">{t('job.workingHours')}</h2>
                <p className="text-white/80">{job.working_hours}</p>
              </div>

              <div className="pt-6">
                <Link
                  to="/submit-resume"
                  className="inline-block bg-white/10 text-white px-6 py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/20 transition"
                >
                  {t('job.apply')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}