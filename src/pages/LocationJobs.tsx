import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';

interface Job {
  id: string;
  title: string;
  salary: string;
  description: string;
  working_hours: string;
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
      const searchLocation = locationMap[location || ''] || location;
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('location', searchLocation)
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('nav.back')}
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <h1 className="text-2xl font-bold">{location}</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  {job.image_url && (
                    <img
                      src={job.image_url}
                      alt={job.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-600">{job.salary}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    {job.working_hours}
                  </p>
                </div>
                <Link 
                  to={`/jobs/${job.id}`}
                  className="mt-4 w-full bg-gray-50 text-blue-600 py-2 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  {t('featured.viewDetails')}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs found in {location}</p>
          </div>
        )}
      </div>
    </div>
  );
}