import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  password: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function EmailVerification({ email, password, onVerificationComplete, onBack }: EmailVerificationProps) {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 调用 Edge Function 验证验证码并创建用户
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email, code, password })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || t('auth.verificationFailed'));
      }

      setInfo(t('auth.verificationSuccess'));
      setTimeout(() => {
        onVerificationComplete();
      }, 1500);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.message || t('auth.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setInfo(null);
    setIsLoading(true);

    try {
      // 调用 Edge Function 重发验证码
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || t('auth.resendFailed'));
      }

      // 处理邮件发送结果
      if (result.email_sent) {
        if (result.debug_code) {
          console.log('新验证码:', result.debug_code);
          setInfo(`验证码已重发！开发模式验证码: ${result.debug_code}`);
        } else {
          setInfo(t('auth.verificationCodeSent') + '，请注意查收');
        }
      } else {
        if (result.debug_code) {
          console.log('新验证码:', result.debug_code);
          setInfo(`邮件服务暂时不可用，开发模式验证码: ${result.debug_code}`);
        } else {
          setError('邮件发送失败，请稍后重试');
          return;
        }
      }
      setCountdown(60); // 60秒倒计时
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err?.message || t('auth.resendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div className="relative group rounded-[22px] p-[2px] bg-gradient-to-tr from-[#00ff75] to-[#3700ff] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(0,255,117,0.3)]">
        <div className="rounded-[20px] bg-[#171717] transition-transform duration-200 group-hover:scale-[0.98]">
          <div className="p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {t('auth.verifyEmail')}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {t('auth.verificationCodeSentTo')} <span className="text-blue-400">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
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
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t('auth.enterVerificationCode')}
                  className="bg-transparent border-0 outline-none w-full text-center text-[#d3d3d3] placeholder-white/60 text-lg tracking-widest"
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                />
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full px-4 py-2 rounded-[5px] bg-[#252525] text-white transition hover:bg-black disabled:opacity-50"
                >
                  {isLoading ? t('auth.verifying') : t('auth.verify')}
                </button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center text-sm text-gray-400 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t('nav.back')}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                    className="flex items-center text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    {countdown > 0 
                      ? `${t('auth.resendIn')} ${countdown}s`
                      : t('auth.resendCode')
                    }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
