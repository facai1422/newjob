import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, CheckCircle } from 'lucide-react';
import { GeometricBackground } from '@/components/ui/geometric-background';

interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
  coverLetter: string;
}

export function ResumeForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ResumeFormData>();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/dashabi/login', { state: { returnTo: '/submit-resume' } });
      return;
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const onSubmit = async (data: ResumeFormData) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/dashabi/login', { state: { returnTo: '/submit-resume' } });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { error } = await supabase
        .from('resumes')
        .insert({
          "fullName": data.fullName,
          email: data.email,
          phone: data.phone,
          education: data.education,
          experience: data.experience,
          skills: data.skills,
          "coverLetter": data.coverLetter,
          user_id: session.user.id,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setShowNotification(true);
      reset();

      // 跳转到我的简历页面查看状态
      setTimeout(() => {
        setShowNotification(false);
        // 通知主页更新按钮状态
        window.dispatchEvent(new Event('resume:submitted'));
        navigate('/my-resume');
      }, 1200);
    } catch (error: any) {
      console.error('Error submitting resume:', error);
      setSubmitError(error?.message || t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <GeometricBackground />
      <div className="relative z-10 max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 text-white">
          <Link 
            to="/" 
            className="inline-flex items-center hover:text-blue-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('nav.back')}
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center hover:text-red-200"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('auth.logout')}
          </button>
        </div>

        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500/15 border border-green-400/50 text-green-200 px-4 py-3 rounded flex items-center shadow-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{t('resume.submitSuccess')}</span>
          </div>
        )}
        {submitError && (
          <div className="mb-4 bg-red-500/15 text-red-200 border border-red-400/40 px-4 py-3 rounded text-sm">
            {submitError}
          </div>
        )}

        <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">{t('resume.submitTitle')}</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.fullName')}
              </label>
              <input
                type="text"
                {...register('fullName', { required: true })}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{t('resume.required')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.email')}
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.phone')}
              </label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.education')}
              </label>
              <textarea
                {...register('education', { required: true })}
                rows={3}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.experience')}
              </label>
              <textarea
                {...register('experience', { required: true })}
                rows={4}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.skills')}
              </label>
              <textarea
                {...register('skills', { required: true })}
                rows={3}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">
                {t('resume.coverLetter')}
              </label>
              <textarea
                {...register('coverLetter', { required: true })}
                rows={5}
                className="mt-1 block w-full rounded-md bg-zinc-800/60 text-white placeholder-white/50 border border-white/10 shadow-sm focus:border-white/20 focus:ring-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-white/10 text-white hover:bg-white/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
            >
              {isSubmitting ? t('resume.submitting') : t('resume.submit')}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}