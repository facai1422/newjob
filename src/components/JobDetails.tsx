import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('nav.back')}
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('job.salary')}</h2>
              <p className="text-gray-600">{job.salary}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('job.description')}</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('job.workingHours')}</h2>
              <p className="text-gray-600">{job.working_hours}</p>
            </div>

            <div className="pt-6">
              <Link
                to="/submit-resume"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {t('job.apply')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}