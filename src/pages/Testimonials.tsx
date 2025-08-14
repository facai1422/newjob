import React from 'react';
import DemoTestimonials3D from '@/components/ui/demo-3d-testimonials';
import DiagonalTestimonialsBG from '@/components/ui/diagonal-testimonials-bg';
import MinimalistDock from '@/components/ui/minimal-dock';
import { supabase } from '@/lib/supabase';
import React from 'react';

type Notification = { id: string; title: string; body: string; link?: string; created_at: string; read_at: string | null };

export default function Testimonials() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [status, setStatus] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      try {
        // 获取当前用户
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 读取最新简历状态
        const { data: resume } = await supabase
          .from('resumes')
          .select('status')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (resume?.status) setStatus(resume.status);

        // 读取通知
        const { data: notes } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setNotifications(notes || []);
      } catch {}
    })();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* 斜向右上/左下滚动背景 */}
      <DiagonalTestimonialsBG />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">My Application</h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">Track your resume review status and read messages from our admins.</p>
        </div>

        {/* 状态卡片 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-white">
            <h3 className="text-lg font-semibold">Review Status</h3>
            <p className="mt-2 text-white/80 capitalize">{status || 'Pending'}</p>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-3 max-h-[50vh] overflow-auto pr-2">
              {notifications.length === 0 ? (
                <p className="text-white/70">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <a key={n.id} href={n.link || '#'} className="block rounded-lg border border-white/10 p-4 hover:bg-white/5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{n.title}</h4>
                      <span className="text-xs text-white/50">{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-white/80">{n.body}</p>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <MinimalistDock />
    </div>
  );
}


