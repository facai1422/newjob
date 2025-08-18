import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleIcon, GoogleIconFallback } from './ui/google-icon';

export function OAuthTest() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        throw error;
      }

      console.log('OAuth initiated:', data);
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError(err.message || 'Google 登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Google OAuth 测试</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {session ? (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ 已登录成功！
            </div>
            
            <div className="space-y-2">
              <p><strong>邮箱:</strong> {session.user.email}</p>
              <p><strong>姓名:</strong> {session.user.user_metadata?.full_name || '未提供'}</p>
              <p><strong>头像:</strong></p>
              {session.user.user_metadata?.avatar_url && (
                <img 
                  src={session.user.user_metadata.avatar_url} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full"
                />
              )}
              <p><strong>提供商:</strong> {session.user.app_metadata?.provider}</p>
              <p><strong>用户ID:</strong> {session.user.id}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              退出登录
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              请使用Google账号登录进行测试
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="relative">
                <GoogleIcon size={20} className="object-contain" />
                <GoogleIconFallback size={20} />
              </div>
              {loading ? '登录中...' : '使用 Google 登录'}
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium mb-2">环境信息:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>当前域名:</strong> {window.location.origin}</p>
            <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
            <p><strong>重定向URL:</strong> {window.location.origin}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
