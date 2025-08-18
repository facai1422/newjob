import React, { useEffect, useState } from 'react';
import { SkeletonLine } from '@/components/ui/skeleton';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Users, BriefcaseIcon, BarChart, ArrowLeft, LogOut, Plus, Edit, Trash2, Send, Settings, UserCheck } from 'lucide-react';
import { UserManagement } from '../components/UserManagement';
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
  email?: string;
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
  rich_description: any; // store as JSON object
}

type JobForm = {
  title: string;
  salary: string;
  description: string;
  working_hours: string;
  image_url: string;
  image_urls?: string[];
  location: string;
  // Rich fields that power user-side cards/modal
  company?: string;
  type?: string;
  openings?: number;
  requirements?: string[];
  benefits?: string[];
  rewards?: string[];
  postedDate?: string;
  companyLogo?: string;
  videoUrl?: string;
  rich_description: any; // full JSON snapshot for convenience
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'users' | 'settings'>('overview');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [settings, setSettings] = useState<CustomerServiceSettings>({
    id: undefined,
    whatsapp_link: '',
    telegram_link: '',
    email: ''
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [carousel, setCarousel] = useState<any[]>([]);
  const [newCarouselUrl, setNewCarouselUrl] = useState('');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobSaveLoading, setJobSaveLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [notifyForm, setNotifyForm] = useState({ userId: '', title: '', body: '', link: '' });
  const [sendingNote, setSendingNote] = useState(false);
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
    company: '',
    type: 'Full Time',
    openings: 1,
    requirements: [],
    benefits: [],
    rewards: [],
    postedDate: '',
    companyLogo: '',
    videoUrl: '',
    rich_description: {}
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
      await Promise.all([fetchResumes(), fetchSettings(), fetchJobs(), fetchCarousel()]);
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
      if (data) setSettings({ id: (data as any).id, whatsapp_link: (data as any).whatsapp_link, telegram_link: (data as any).telegram_link, email: (data as any).email || '' });
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

  const fetchCarousel = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setCarousel(data || []);
    } catch (e) {
      // 表可能尚未创建，忽略错误
    }
  };

  const addCarousel = async () => {
    if (!newCarouselUrl.trim()) return;
    const maxOrder = Math.max(0, ...carousel.map((c: any) => Number(c.sort_order) || 0));
    const { error } = await supabase
      .from('carousel_items')
      .insert([{ type: 'image', src: newCarouselUrl.trim(), sort_order: maxOrder + 1, is_active: true }]);
    if (!error) {
      setNewCarouselUrl('');
      await fetchCarousel();
    }
  };

  const removeCarousel = async (id: string) => {
    const { error } = await supabase.from('carousel_items').delete().eq('id', id);
    if (!error) await fetchCarousel();
  };

  const toggleCarousel = async (id: string, active: boolean) => {
    const { error } = await supabase.from('carousel_items').update({ is_active: !active }).eq('id', id);
    if (!error) await fetchCarousel();
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
            email: settings.email || '',
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
            email: settings.email || '',
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
      // Normalize rich_description JSON
      const rich: any = {
        company: jobForm.company,
        type: jobForm.type,
        openings: jobForm.openings,
        requirements: jobForm.requirements,
        benefits: jobForm.benefits,
        rewards: jobForm.rewards,
        postedDate: jobForm.postedDate,
        companyLogo: jobForm.companyLogo,
        videoUrl: jobForm.videoUrl
      };
      const payload: any = {
        title: jobForm.title,
        salary: jobForm.salary,
        description: jobForm.description,
        working_hours: jobForm.working_hours,
        image_url: jobForm.image_url,
        image_urls: jobForm.image_urls,
        location: jobForm.location,
        rich_description: rich
      };
      const fallbackPayload = {
        title: jobForm.title,
        salary: jobForm.salary,
        description: jobForm.description,
        working_hours: jobForm.working_hours
      };
      if (editingJob) {
        let { error } = await supabase
          .from('jobs')
          .update(payload)
          .eq('id', editingJob.id);
        if (error) {
          // If schema lacks columns, fallback to base fields only
          const needsFallback = /column .* does not exist|42703/i.test(error.message || '');
          if (!needsFallback) throw error;
          ({ error } = await supabase
            .from('jobs')
            .update(fallbackPayload)
            .eq('id', editingJob.id));
          if (error) throw error;
        }
      } else {
        let { error } = await supabase
          .from('jobs')
          .insert([payload]);
        if (error) {
          const needsFallback = /column .* does not exist|42703/i.test(error.message || '');
          if (!needsFallback) throw error;
          ({ error } = await supabase
            .from('jobs')
            .insert([fallbackPayload]));
          if (error) throw error;
        }
      }

      setIsAddingJob(false);
      setEditingJob(null);
      setJobForm({ title: '', salary: '', description: '', working_hours: '', image_url: '', image_urls: [], location: '', company: '', type: 'Full Time', openings: 1, requirements: [], benefits: [], rewards: [], postedDate: '', companyLogo: '', videoUrl: '', rich_description: {} });
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

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSendingNote(true);
      if (!notifyForm.userId || !notifyForm.title || !notifyForm.body) return;
      const { error } = await supabase.from('notifications').insert([{
        recipient_id: notifyForm.userId,
        recipient_type: 'user',
        title: notifyForm.title,
        message: notifyForm.body,
        type: 'admin',
        related_id: null,
        related_type: null,
        is_read: false,
        is_email_sent: false
      }]);
      if (error) throw error;
      setNotifyForm({ userId: '', title: '', body: '', link: '' });
      alert('Notification sent');
    } catch (err) {
      console.error(err);
      alert('Failed to send');
    } finally {
      setSendingNote(false);
    }
  };

  const startEditJob = (job: Job) => {
    setEditingJob(job);
    const meta: any = job.rich_description || {};
    setJobForm({
      title: job.title,
      salary: job.salary,
      description: job.description,
      working_hours: job.working_hours,
      image_url: job.image_url || '',
      image_urls: job.image_urls || [],
      location: job.location || '',
      company: meta.company || '',
      type: meta.type || 'Full Time',
      openings: meta.openings || 1,
      requirements: meta.requirements || [],
      benefits: meta.benefits || [],
      rewards: meta.rewards || [],
      postedDate: meta.postedDate || '',
      companyLogo: meta.companyLogo || '',
      videoUrl: meta.videoUrl || '',
      rich_description: meta
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
      <div className="relative min-h-screen">
        <div className="absolute inset-0 -z-10">
          <HeroGeometric badge="Admin" title1="Hirely" title2="Dashboard" />
        </div>
        <nav className="bg-black/80 backdrop-blur border-b border-white/10 h-16" />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 [content-visibility:auto] [contain-intrinsic-size:1px_200px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-card">
                <div className="admin-card-inner p-5">
                  <div className="space-y-2">
                    <SkeletonLine className="w-1/2 h-4" />
                    <SkeletonLine className="w-1/3 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 admin-card">
            <div className="admin-card-inner px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <SkeletonLine className="w-1/4 h-6" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 py-3">
                    <SkeletonLine className="w-1/3 h-4" />
                    <SkeletonLine className="w-1/4 h-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
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
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
              <div className="text-sm text-gray-600">管理后台</div>
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

      {/* 标签页导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: '概览', icon: BarChart },
              { id: 'jobs', name: '岗位管理', icon: BriefcaseIcon },
              { id: 'users', name: '用户管理', icon: UserCheck },
              { id: 'settings', name: '系统设置', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* 概览标签页 */}
          {activeTab === 'overview' && (
            <>
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
                  <h3 className="text-lg leading-6 font-semibold text-white">{t('admin.jobPostings')}</h3>
                  <button
                    onClick={() => {
                      setIsAddingJob(true);
                      setEditingJob(null);
                      setJobForm({ title: '', salary: '', description: '', working_hours: '', image_url: '', location: '', rich_description: [] as any[] });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.addNewJob')}
                  </button>
                </div>

                {isAddingJob && createPortal((
                  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="admin-card p-0 max-w-2xl w-full text-white relative z-[10000] max-h-[85vh] overflow-y-auto">
                      <div className="admin-card-inner p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingJob ? t('admin.editJobPosting') : t('admin.addNewJobPosting')}
                      </h3>
                      {jobError && (
                        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {jobError}
                        </div>
                      )}
                      <form onSubmit={handleJobSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80">{t('admin.title')}</label>
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
                          <label className="block text-sm font-medium text-white/80">{t('admin.company')}</label>
                          <input
                            type="text"
                            value={jobForm.company || ''}
                            onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">{t('admin.salary')}</label>
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
                          <label className="block text-sm font-medium text-white/80">{t('admin.imageUrl')}</label>
                          <input
                            type="url"
                            value={jobForm.image_url}
                            onChange={(e) => setJobForm({ ...jobForm, image_url: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="https://example.com/image.jpg"
                            aria-label="Image URL"
                          />
                          <label className="block mt-4 text-sm font-medium text-white/80">{t('admin.addImageUrls')}</label>
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
                          <label className="block text-sm font-medium text-white/80">{t('admin.location')}</label>
                          <select
                            value={jobForm.location}
                            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white border border-white/20"
                            aria-label="Location"
                            required
                          >
                            <option value="">{t('admin.selectLocation')}</option>
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
                          <label className="block text-sm font-medium text-white/80">{t('admin.description')}</label>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80">{t('admin.type')}</label>
                            <input
                              type="text"
                              value={jobForm.type || ''}
                              onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                              className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                              placeholder="Full Time / Part Time"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80">{t('admin.openings')}</label>
                            <input
                              type="number"
                              min={1}
                              value={jobForm.openings || 1}
                              onChange={(e) => setJobForm({ ...jobForm, openings: Number(e.target.value) })}
                              className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                              placeholder="Openings"
                              aria-label="Openings"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80">{t('admin.postedDate')}</label>
                            <input
                              type="text"
                              value={jobForm.postedDate || ''}
                              onChange={(e) => setJobForm({ ...jobForm, postedDate: e.target.value })}
                              className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                              placeholder="2024-01-01"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">{t('admin.requirements')}</label>
                          <input
                            type="text"
                            value={(jobForm.requirements || []).join(', ')}
                            onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Requirement A, Requirement B"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">{t('admin.benefits')}</label>
                          <input
                            type="text"
                            value={(jobForm.benefits || []).join(', ')}
                            onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Benefit A, Benefit B"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">{t('admin.rewards')}</label>
                          <input
                            type="text"
                            value={(jobForm.rewards || []).join(', ')}
                            onChange={(e) => setJobForm({ ...jobForm, rewards: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="Reward A, Reward B"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80">{t('admin.companyLogo')}</label>
                            <input
                              type="url"
                              value={jobForm.companyLogo || ''}
                              onChange={(e) => setJobForm({ ...jobForm, companyLogo: e.target.value })}
                              className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                              placeholder="https://example.com/logo.png"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/80">{t('admin.videoUrl')}</label>
                            <input
                              type="url"
                              value={jobForm.videoUrl || ''}
                              onChange={(e) => setJobForm({ ...jobForm, videoUrl: e.target.value })}
                              className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                              placeholder="https://example.com/video.mp4"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80">{t('admin.workingHours')}</label>
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
                             {t('admin.cancel')}
                          </button>
                          <button
                            type="submit"
                            disabled={jobSaveLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
                            onClick={(ev) => {
                              // 防止外层点击冒泡关闭，保证按钮可响应
                              ev.stopPropagation();
                            }}
                          >
                             {jobSaveLoading ? t('admin.saving') : (editingJob ? t('admin.saveChanges') : t('admin.createJob'))}
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">{t('admin.tableTitle')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">{t('admin.tableSalary')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">{t('admin.tableWorkingHours')}</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">{t('admin.tableActions')}</th>
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
                                 aria-label={t('admin.editJob')}
                                 title={t('admin.editJob')}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="text-red-400 hover:text-red-300"
                                 aria-label={t('admin.deleteJob')}
                                 title={t('admin.deleteJob')}
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



            {/* Notifications tool */}
            <div className="admin-card mt-8 text-white">
              <div className="admin-card-inner px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-white flex items-center gap-2"><Send className="h-4 w-4" /> Send Notification</h3>
                <form onSubmit={sendNotification} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Target User ID"
                    value={notifyForm.userId}
                    onChange={(e) => setNotifyForm({ ...notifyForm, userId: e.target.value })}
                    className="rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20 md:col-span-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={notifyForm.title}
                    onChange={(e) => setNotifyForm({ ...notifyForm, title: e.target.value })}
                    className="rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Optional Link"
                    value={notifyForm.link}
                    onChange={(e) => setNotifyForm({ ...notifyForm, link: e.target.value })}
                    className="rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                  />
                  <textarea
                    placeholder="Message body"
                    value={notifyForm.body}
                    onChange={(e) => setNotifyForm({ ...notifyForm, body: e.target.value })}
                    className="rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20 md:col-span-3"
                    rows={3}
                    required
                  />
                  <div className="flex items-end">
                    <button type="submit" disabled={sendingNote} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60">
                      {sendingNote ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
              </div>
            </div>
            </>
          )}

          {/* 岗位管理标签页 */}
          {activeTab === 'jobs' && (
            <div className="admin-card text-white">
              <div className="admin-card-inner px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-semibold text-white">{t('admin.jobPostings')}</h3>
                  <button
                    onClick={() => {
                      setIsAddingJob(true);
                      setEditingJob(null);
                      setJobForm({ title: '', salary: '', description: '', working_hours: '', image_url: '', location: '', rich_description: [] as any[] });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.addNewJob')}
                  </button>
                </div>
                <p className="text-white/80">岗位管理功能已移至此标签页 - 功能保持不变</p>
              </div>
            </div>
          )}

          {/* 用户管理标签页 */}
          {activeTab === 'users' && (
            <UserManagement />
          )}

          {/* 系统设置标签页 */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* 客服设置 */}
              <div className="admin-card">
                <div className="admin-card-inner px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-white">客服设置</h3>
                  <div className="mt-5">
                    {isEditingSettings ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="whatsapp" className="block text-sm font-medium text-white/80">WhatsApp 链接</label>
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
                          <label htmlFor="telegram" className="block text-sm font-medium text-white/80">Telegram 链接</label>
                          <input
                            type="text"
                            id="telegram"
                            value={settings.telegram_link}
                            onChange={(e) => setSettings({ ...settings, telegram_link: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="https://t.me/your-username"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-white/80">客服邮箱</label>
                          <input
                            type="email"
                            id="email"
                            value={settings.email || ''}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="mt-1 block w-full rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                            placeholder="support@example.com"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsEditingSettings(false)}
                            className="px-4 py-2 border border-white/30 rounded-md text-white hover:bg-white/10"
                          >
                            取消
                          </button>
                          <button
                            onClick={handleSettingsUpdate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            保存更改
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-white/70">WhatsApp 链接</h4>
                          <p className="mt-1 text-sm text-white">{settings.whatsapp_link || '未设置'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white/70">Telegram 链接</h4>
                          <p className="mt-1 text-sm text-white">{settings.telegram_link || '未设置'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white/70">客服邮箱</h4>
                          <p className="mt-1 text-sm text-white">{settings.email || '未设置'}</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setIsEditingSettings(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            编辑设置
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 轮播图管理 */}
              <div className="admin-card text-white">
                <div className="admin-card-inner px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-white">首页轮播图管理</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={newCarouselUrl}
                        onChange={(e) => setNewCarouselUrl(e.target.value)}
                        placeholder="输入图片URL或视频URL"
                        className="flex-1 rounded-md p-2 bg-black/30 text-white placeholder-white/60 border border-white/20"
                      />
                      <button 
                        onClick={addCarousel}
                        className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white"
                      >
                        添加
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {carousel.map((item, index) => (
                        <div key={item.id} className="relative group">
                          {item.type === 'video' ? (
                            <video src={item.src} className="w-full h-32 object-cover rounded" controls />
                          ) : (
                            <img src={item.src} alt={item.alt || `轮播图 ${index + 1}`} className="w-full h-32 object-cover rounded" />
                          )}
                          <button
                            onClick={() => removeCarousel(item.id)}
                            title="删除轮播图"
                            aria-label="删除轮播图"
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}