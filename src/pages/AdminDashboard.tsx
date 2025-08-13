import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Users, BriefcaseIcon, BarChart, ArrowLeft, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

interface Resume {
  id: number;
  fullName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  education: string;
  experience: string;
  skills: string;
  coverLetter: string;
}

interface CustomerServiceSettings {
  id?: string;
  whatsapp_link: string;
  telegram_link: string;
}

interface Job {
  id: string;
  title: string;
  salary: string;
  description: string;
  working_hours: string;
  image_url: string;
  location: string;
  image_urls?: string[];
  rich_description: any[];
}

type JobForm = {
  title: string;
  salary: string;
  description: string;
  working_hours: string;
  image_url: string;
  image_urls?: string[];
  location: string;
  rich_description: any[];
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [settings, setSettings] = useState<CustomerServiceSettings>({
    id: undefined,
    whatsapp_link: '',
    telegram_link: ''
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobSaveLoading, setJobSaveLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  // const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  // const [isAddingSubAccount, setIsAddingSubAccount] = useState(false);
  // const [subAccounts, setSubAccounts] = useState<any[]>([]);
  // const [subAccountForm, setSubAccountForm] = useState({
  //   email: '',
  //   permissions: {
  //     manage_jobs: false,
  //     view_resumes: false,
  //     manage_resumes: false
  //   }
  // });
  const [jobForm, setJobForm] = useState<JobForm>({
    title: '',
    salary: '',
    description: '',
    working_hours: '',
    image_url: '',
    image_urls: [],
    location: '',
    rich_description: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchData();
    fetchSubAccounts();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/dashabi/login');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || (user.email !== 'admin@example.com' && user.email !== 'mz2503687@gmail.com' && user.email !== 'it@haixin.org')) {
        navigate('/dashabi/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Lock background scroll when modal open
  useEffect(() => {
    if (isAddingJob) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isAddingJob]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || (user.email !== 'admin@example.com' && user.email !== 'mz2503687@gmail.com' && user.email !== 'it@haixin.org')) {
        navigate('/dashabi/login');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/dashabi/login');
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchResumes(), fetchSettings(), fetchJobs()]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/dashabi/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_service_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      if (data) setSettings({ id: (data as any).id, whatsapp_link: (data as any).whatsapp_link, telegram_link: (data as any).telegram_link });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchSubAccounts = async () => {};

  // Placeholder to satisfy type/lint; sub-accounts UI not rendered currently
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubAccountSubmit = async (_e: React.FormEvent) => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdatePermissions = async (_id: string, _permissions: any) => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteSubAccount = async (_id: string) => {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResumeAction = async (_id: number, _status: 'approved' | 'rejected') => {};

  const handleSettingsUpdate = async () => {
    try {
      if (settings.id) {
        const { error } = await supabase
          .from('customer_service_settings')
          .update({
            whatsapp_link: settings.whatsapp_link,
            telegram_link: settings.telegram_link,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customer_service_settings')
          .insert({
            whatsapp_link: settings.whatsapp_link,
            telegram_link: settings.telegram_link,
            updated_at: new Date().toISOString()
          });
        if (error) throw error;
      }
      setIsEditingSettings(false);
      await fetchSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobError(null);
    setJobSaveLoading(true);
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update({
            title: jobForm.title,
            salary: jobForm.salary,
            description: jobForm.description,
            working_hours: jobForm.working_hours,
            image_url: jobForm.image_url,
            image_urls: jobForm.image_urls,
            location: jobForm.location,
            rich_description: jobForm.rich_description
          })
          .eq('id', editingJob.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([{ ...jobForm }]);

        if (error) throw error;
      }

      setIsAddingJob(false);
      setEditingJob(null);
      setJobForm({ title: '', salary: '', description: '', working_hours: '', image_url: '', image_urls: [], location: '', rich_description: [] as any[] });
      await fetchJobs();
    } catch (error: any) {
      console.error('Error saving job:', error);
      const message = error?.message || 'Failed to save job. Please try again.';
      setJobError(message);
    } finally {
      setJobSaveLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const startEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      salary: job.salary,
      description: job.description,
      working_hours: job.working_hours,
      image_url: job.image_url || '',
      image_urls: job.image_urls || [],
      location: job.location || '',
      rich_description: (job.rich_description as any[]) || []
    });
    setIsAddingJob(true);
  };

  type StatItem = {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
  };

  const stats: StatItem[] = [
    { label: t('stats.totalResumes'), value: resumes.length, icon: BriefcaseIcon },
    { label: t('stats.pendingResumes'), value: resumes.filter(r => r.status === 'pending').length, icon: BarChart },
    { label: t('stats.approvedResumes'), value: resumes.filter(r => r.status === 'approved').length, icon: Users },
    { label: t('stats.rejectedResumes'), value: resumes.filter(r => r.status === 'rejected').length, icon: Users }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <HeroGeometric badge="Admin" title1="Hirely" title2="Dashboard" />
      </div>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('nav.back')}
              </Link>
              <h1 className="ml-4 text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="admin-card">
                <div className="admin-card-inner p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-yellow-300" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-white/70 truncate">
                          {stat.label}
                        </dt>
                        <dd className="text-2xl font-semibold text-white">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="admin-card mb-8 text-white">
              <div className="admin-card-inner px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-semibold text-white">
                    Job Postings
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingJob(true);
                      setEditingJob(null);
                      setJobForm({ title: '', salary: '', description: '', working_hours: '', image_url: '', location: '', rich_description: [] as any[] });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </button>
                </div>

                {isAddingJob && createPortal((
                  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="admin-card p-0 max-w-2xl w-full text-white relative z-[10000] max-h-[85vh] overflow-y-auto">
                      <div className="admin-card-inner p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingJob ? 'Edit Job Posting' : 'Add New Job Posting'}
                      </h3>
                      {jobError && (
                        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {jobError}
                        </div>
                      )}
                      <form onSubmit={handleJobSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80">Title</label>
                          <input
                            type="text"
                            value={jobForm.title}
                            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Job title"
                            aria-label="Job title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">Salary</label>
                          <input
                            type="text"
                            value={jobForm.salary}
                            onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Salary range"
                            aria-label="Salary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">Image URL (primary)</label>
                          <input
                            type="url"
                            value={jobForm.image_url}
                            onChange={(e) => setJobForm({ ...jobForm, image_url: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="https://example.com/image.jpg"
                            aria-label="Image URL"
                          />
                          <label className="block mt-4 text-sm font-medium text-white/80">Additional Image URLs (comma separated)</label>
                          <input
                            type="text"
                            value={(jobForm.image_urls || []).join(', ')}
                            onChange={(e) => setJobForm({ ...jobForm, image_urls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="https://a.jpg, https://b.jpg"
                            aria-label="Additional Image URLs"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">Location</label>
                          <select
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white border border-white/20"
                            aria-label="Location"
                            required
                          >
                            <option value="">Select Location</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Oman">Oman</option>
                            <option value="Philippines">Philippines</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">Description</label>
                          <textarea
                            value={jobForm.description}
                            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                            rows={4}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Job description"
                            aria-label="Job description"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">Working Hours</label>
                          <input
                            type="text"
                            value={jobForm.working_hours}
                            onChange={(e) => setJobForm({ ...jobForm, working_hours: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Working hours"
                            aria-label="Working hours"
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingJob(false);
                              setEditingJob(null);
                            }}
                            className="px-4 py-2 border border-white/30 rounded-md text-white hover:bg-white/10"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={jobSaveLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
                          >
                            {jobSaveLoading ? 'Saving...' : (editingJob ? 'Save Changes' : 'Create Job')}
                          </button>
                        </div>
                      </form>
                      </div>
                    </div>
                  </div>
                ), document.body)}

                <div className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-transparent">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Salary</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Working Hours</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-transparent divide-y divide-white/10">
                        {jobs.map((job) => (
                          <tr key={job.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{job.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{job.salary}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {job.working_hours}
                              <br />
                              <span className="text-yellow-300">{job.location}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => startEditJob(job)}
                                className="text-blue-400 hover:text-blue-300 mr-4"
                                aria-label="Edit job"
                                title="Edit job"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="text-red-400 hover:text-red-300"
                                aria-label="Delete job"
                                title="Delete job"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
            <div className="admin-card">
              <div className="admin-card-inner px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-white">
                    Customer Service Settings
                  </h3>
                  <div className="mt-5">
                    {isEditingSettings ? (
                      <div className="space-y-4">
                        <div>
                        <label htmlFor="whatsapp" className="block text-sm font-medium text-white/80">
                            WhatsApp Link
                          </label>
                          <input
                            type="text"
                            id="whatsapp"
                            value={settings.whatsapp_link}
                            onChange={(e) => setSettings({ ...settings, whatsapp_link: e.target.value })}
                          className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="https://wa.me/your-number"
                          />
                        </div>
                        <div>
                        <label htmlFor="telegram" className="block text-sm font-medium text-white/80">
                            Telegram Link
                          </label>
                          <input
                            type="text"
                            id="telegram"
                            value={settings.telegram_link}
                            onChange={(e) => setSettings({ ...settings, telegram_link: e.target.value })}
                          className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="https://t.me/your-username"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsEditingSettings(false)}
                          className="px-4 py-2 border border-white/30 rounded-md text-white hover:bg-white/10"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSettingsUpdate}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                        <h4 className="text-sm font-medium text-white/70">WhatsApp Link</h4>
                        <p className="mt-1 text-sm text-white">{settings.whatsapp_link || 'Not set'}</p>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-white/70">Telegram Link</h4>
                        <p className="mt-1 text-sm text-white">{settings.telegram_link || 'Not set'}</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setIsEditingSettings(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Settings
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}