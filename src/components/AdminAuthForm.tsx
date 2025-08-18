import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowLeft, Mail, Lock, Shield } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

export function AdminAuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // 管理员邮箱白名单
  const adminEmails = ['admin@example.com', 'mz2503687@gmail.com', 'it@haixin.org'];

  React.useEffect(() => {
    // 检查是否已登录管理员
    const checkAdminAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase() || '';
          if (adminEmails.includes(userEmail)) {
            navigate('/dashabi/dashboard', { replace: true });
          } else {
            // 非管理员用户，强制登出
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 首先验证邮箱是否在管理员白名单中
      if (!adminEmails.includes(email.trim().toLowerCase())) {
        throw new Error('此邮箱无管理员权限');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        // 再次确认邮箱权限
        const userEmail = data.user.email?.toLowerCase() || '';
        if (adminEmails.includes(userEmail)) {
          navigate('/dashabi/dashboard', { replace: true });
        } else {
          // 安全起见，如果不是管理员邮箱，立即登出
          await supabase.auth.signOut();
          throw new Error('权限验证失败');
        }
      }
    } catch (err: any) {
      console.error('Admin auth error:', err);
      setError(err?.message || '登录失败，请检查邮箱和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10">
        <HeroGeometric badge="Admin Portal" title1="管理后台" title2="系统登录" />
      </div>
      
      <div className="p-4 flex justify-between items-start">
        <Link 
          to="/dashabi/login" 
          className="inline-flex items-center text-white hover:text-blue-100"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          返回
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="relative group rounded-[22px] p-[2px] bg-gradient-to-tr from-[#ff4757] to-[#ff3838] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(255,71,87,0.3)]">
            <div className="rounded-[20px] bg-[#171717] transition-transform duration-200 group-hover:scale-[0.98]">
              <div className="p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">管理后台登录</h2>
                  <p className="mt-2 text-center text-sm text-gray-400">
                    仅限授权管理员访问
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 rounded-[25px] p-3 bg-[#171717] text-white shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                    <Mail className="w-5 h-5 text-white" />
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="管理员邮箱"
                      className="bg-transparent border-0 outline-none w-full text-[#d3d3d3] placeholder-white/60"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-[25px] p-3 bg-[#171717] text-white shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
                    <Lock className="w-5 h-5 text-white" />
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="密码"
                      className="bg-transparent border-0 outline-none w-full text-[#d3d3d3] placeholder-white/60"
                    />
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 rounded-[5px] bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '登录中...' : '登录管理后台'}
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    此系统仅供授权管理员使用<br />
                    如需帮助请联系系统管理员
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
