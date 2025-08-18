import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

import { HeroGeometric } from '@/components/ui/shape-landing-hero';

import { LanguageSelector } from './LanguageSelector';
import { GoogleIcon, GoogleIconFallback } from './ui/google-icon';

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
        // 使用Supabase邮箱OTP验证码
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true
          }
        });

        if (error) {
          throw error;
        }

        setInfo(t('auth.verificationCodeSent'));
        return;
      } else {
        // For login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        if (data.user) {
          // 用户端登录，直接跳转到指定页面或首页
          const fromReturnTo = returnToQuery || (location.state as any)?.returnTo || '';
          const returnTo = fromReturnTo || '/';
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
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: isRegistering
        }
      });
      if (resendError) throw resendError;
      setInfo(t('auth.verificationCodeSent'));
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
                <div className="relative">
                  <GoogleIcon size={20} className="object-contain" />
                  <GoogleIconFallback size={20} />
                </div>
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