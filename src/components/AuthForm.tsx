import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

import { HeroGeometric } from '@/components/ui/shape-landing-hero';

import { LanguageSelector } from './LanguageSelector';

export function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnToQuery = searchParams.get('returnTo') || '';
  const { t } = useLanguage();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [info, setInfo] = React.useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        // 使用Supabase原生邮箱验证
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashabi/login?verified=true`
          }
        });

        if (error) {
          throw error;
        }

        setInfo(t('auth.confirmationSent'));
        return;
      } else {
        // For login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        if (data.user) {
          // Special handling for admin and recruiter
          const isAdminEmail = ['admin@example.com', 'mz2503687@gmail.com', 'it@haixin.org'].includes(email.trim().toLowerCase());
          const fromReturnTo = returnToQuery || (location.state as any)?.returnTo || '';
          const returnTo = isAdminEmail ? '/dashabi/dashboard' : (fromReturnTo || '/');
          navigate(returnTo, { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Handle specific error cases
      const message: string = err?.message || '';
      if (
        message.includes('Email not confirmed') ||
        message.includes('email_not_confirmed') ||
        message.includes('Email address not confirmed')
      ) {
        setError(t('auth.emailNotConfirmed'));
      } else {
        setError(message || t('auth.genericError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    if (!email) {
      setError(t('resume.required'));
      return;
    }
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (resendError) throw resendError;
      setInfo(t('auth.confirmationSent'));
    } catch (e: any) {
      setError(e?.message || t('auth.genericError'));
    }
  };



  // Google 登录
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${returnToQuery || '/'}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err?.message || 'Google 登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // no reset password button per requirement

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10">
        <HeroGeometric badge="Hirely" title1="Welcome" title2="Sign in / Register" />
      </div>
      <div className="p-4 flex justify-between items-start">
        <Link 
          to="/" 
          className="inline-flex items-center text-white hover:text-blue-100"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('nav.back')}
        </Link>
        
        <LanguageSelector />
      </div>
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-md w-full space-y-6">
          <div className="relative group rounded-[22px] p-[2px] bg-gradient-to-tr from-[#00ff75] to-[#3700ff] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(0,255,117,0.3)]">
            <div className="rounded-[20px] bg-[#171717] transition-transform duration-200 group-hover:scale-[0.98]">
              <div className="p-8">
          <div>
            <p id="heading" className="mt-2 text-center text-xl font-semibold text-white">
              {isRegistering ? t('auth.register') : t('auth.login')}
            </p>
            <p className="mt-2 text-center text-sm text-gray-600">
              {location.state?.returnTo === '/submit-resume' 
                ? t('auth.resumeAccess')
                : isRegistering ? t('auth.createAccount') : t('auth.adminAccess')}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {info && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                {info}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 rounded-[25px] p-3 bg-[#171717] text-white shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
              <Mail className="w-5 h-5 text-white" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('auth.email')}
                className="bg-transparent border-0 outline-none w-full text-[#d3d3d3] placeholder-white/60"
              />
            </div>

            <div className="flex items-center justify-center gap-2 rounded-[25px] p-3 bg-[#171717] text-white shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
              <Lock className="w-5 h-5 text-white" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('auth.password')}
                className="bg-transparent border-0 outline-none w-full text-[#d3d3d3] placeholder-white/60"
              />
            </div>

            <div className="flex flex-col space-y-4">
              {/* Google 登录按钮 */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-[5px] bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? '登录中...' : '使用 Google 登录'}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-gray-500 text-sm">或</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="flex justify-center gap-2 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-[5px] bg-[#252525] text-white transition hover:bg-black disabled:opacity-50"
                >
                  {isLoading 
                    ? t('auth.processing')
                    : isRegistering 
                      ? t('auth.registerButton') 
                      : t('auth.loginButton')}
                </button>
              </div>

              {isRegistering ? (
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-sm text-blue-400 hover:underline text-center"
                >
                  {t('auth.haveAccount')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-sm text-blue-400 hover:underline text-center"
                >
                  {t('auth.needAccount')}
                </button>
              )}

              {error === t('auth.emailNotConfirmed') && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="w-full flex justify-center py-2 px-4 border rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  {t('auth.resendConfirmation')}
                </button>
              )}
            </div>
          </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}