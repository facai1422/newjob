import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { CanvasRevealEffect } from './ui/sign-in-flow-1';

interface ModernAuthFormProps {
  className?: string;
}

export function ModernAuthForm({ className }: ModernAuthFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnToQuery = searchParams.get('returnTo') || '';
  const { t } = useLanguage();
  
  // 状态管理
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 动画状态
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  
  // 引用
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 聚焦到验证码输入框
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);
  




  // 处理邮箱提交
  const handleEmailSubmit = async (e: React.FormEvent) => {
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
        // 跳到验证码输入页面
        setStep("code");
      } else {
        // 普通登录
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        if (data.user) {
          // 管理员判断
          const isAdminEmail = ['admin@example.com', 'mz2503687@gmail.com', 'it@haixin.org'].includes(email.trim().toLowerCase());
          const returnTo = isAdminEmail ? '/dashabi/dashboard' : (returnToQuery || '/');
          
          setStep("success");
          setTimeout(() => {
            navigate(returnTo, { replace: true });
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err?.message || '操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理验证码输入
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // 自动跳转到下一个输入框
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
      
      // 如果是最后一位且所有位都已填写，自动验证
      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          handleVerifyCode(newCode.join(''));
        }
      }
    }
  };

  // 处理验证码验证
  const handleVerifyCode = async (fullCode?: string) => {
    const codeToVerify = fullCode || code.join('');
    setError(null);
    setInfo(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        // 验证OTP码
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: codeToVerify,
          type: 'email'
        });

        if (error) {
          throw error;
        }

        // 如果验证成功，需要设置密码（因为OTP注册不设置密码）
        if (data.user && password) {
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          });
          
          if (updateError) {
            console.warn('Password update failed:', updateError);
          }
        }

        setInfo(t('auth.verificationSuccess'));
        
        // 动画效果
        setReverseCanvasVisible(true);
        setTimeout(() => {
          setInitialCanvasVisible(false);
        }, 50);
        
        setTimeout(() => {
          setStep("success");
          setTimeout(() => {
            navigate(returnToQuery || '/');
          }, 2000);
        }, 2000);
      } else {
        // 登录时的OTP验证
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: codeToVerify,
          type: 'email'
        });

        if (error) {
          throw error;
        }

        setStep("success");
        setTimeout(() => {
          navigate(returnToQuery || '/');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.message || t('auth.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 键盘导航
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // 返回邮箱步骤
  const handleBackToEmail = () => {
    setStep("email");
    setCode(['', '', '', '', '', '']);
    setError(null);
    setInfo(null);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  // 重发验证码
  const handleResendCode = async () => {
    setError(null);
    setInfo(null);
    setIsLoading(true);

    try {
      // 重新发送OTP验证码
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: isRegistering
        }
      });

      if (error) {
        throw error;
      }

      setInfo(t('auth.verificationCodeSent'));
    } catch (err: any) {
      setError(err?.message || t('auth.resendFailed'));
    } finally {
      setIsLoading(false);
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

      // OAuth 会重定向，这里通常不会执行
      console.log('Google OAuth initiated:', data);
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err?.message || 'Google 登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex w-full flex-col min-h-screen bg-black relative", className)}>
      {/* 背景动画 */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* 顶部语言选择器 */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div 
                key="email-step"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                    {isRegistering ? t('auth.createAccount') : t('auth.welcomeBack')}
                  </h1>
                  <p className="text-[1.8rem] text-white/70 font-light">
                    {isRegistering ? t('auth.joinOurPlatform') : t('auth.signInToAccount')}
                  </p>
                </div>
                
                {/* 错误和信息提示 */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-lg text-sm">
                    {info}
                  </div>
                )}
                
                <div className="space-y-4">
                  <button 
                    onClick={handleGoogleSignIn}
                    className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors"
                  >
                    <span className="text-lg">G</span>
                    <span>{t('auth.continueWithGoogle')}</span>
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-white/40 text-sm">{t('auth.orContinueWith')}</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder={t('auth.enterEmailAddress')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center bg-transparent"
                        required
                      />
                    </div>
                    
                    {!isRegistering && (
                      <div className="relative">
                        <input 
                          type="password" 
                          placeholder={t('auth.enterPassword')}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center bg-transparent"
                          required
                        />
                      </div>
                    )}

                    {isRegistering && (
                      <div className="relative">
                        <input 
                          type="password" 
                          placeholder={t('auth.enterPassword')}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border-white/30 text-center bg-transparent"
                          required
                          minLength={6}
                        />
                      </div>
                    )}
                    
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? t('auth.processing') : (isRegistering ? t('auth.continue') : t('auth.signIn'))}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-sm text-white/50 hover:text-white/70 transition-colors"
                  >
                    {isRegistering ? t('auth.switchToLogin') : t('auth.switchToRegister')}
                  </button>
                </div>
              </motion.div>
            ) : step === "code" ? (
              <motion.div 
                key="code-step"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">{t('auth.verifyEmail')}</h1>
                  <p className="text-[1.25rem] text-white/50 font-light">{t('auth.verificationCodeSentTo')} {email}</p>
                </div>

                {/* 错误和信息提示 */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-lg text-sm">
                    {info}
                  </div>
                )}
                
                <div className="w-full">
                  <div className="relative rounded-full py-4 px-5 border border-white/10 bg-transparent">
                    <div className="flex items-center justify-center">
                      {code.map((digit, i) => (
                        <div key={i} className="flex items-center">
                          <div className="relative">
                            <input
                              ref={(el) => {
                                codeInputRefs.current[i] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              onChange={e => handleCodeChange(i, e.target.value)}
                              onKeyDown={e => handleKeyDown(i, e)}
                              className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none [caret-color:transparent]"
                              title={`${t('auth.enterCode')} ${i + 1}`}
                            />
                            {!digit && (
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                <span className="text-xl text-white/30">0</span>
                              </div>
                            )}
                          </div>
                          {i < code.length - 1 && (
                            <div className="w-4 h-px bg-white/10 mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <motion.button 
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-white/50 hover:text-white/70 transition-colors cursor-pointer text-sm disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t('auth.didntReceiveCode')} {t('auth.resend')}
                  </motion.button>
                </div>
                
                <div className="flex w-full gap-3">
                  <motion.button 
                    onClick={handleBackToEmail}
                    className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t('auth.backToLogin')}
                  </motion.button>
                  <motion.button 
                    onClick={() => handleVerifyCode()}
                    disabled={!code.every(d => d !== "") || isLoading}
                    className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                      code.every(d => d !== "") && !isLoading
                      ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer" 
                      : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? t('auth.verifying') : t('auth.verifyAndContinue')}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success-step"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                    {t('auth.accountCreated')}
                  </h1>
                  <p className="text-[1.25rem] text-white/50 font-light">{t('auth.welcomeToHirely')}</p>
                </div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="py-10"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-white/50 text-sm"
                >
                  {t('auth.redirecting')}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
