import React from 'react';
import { supabase } from '@/lib/supabase';
import MinimalistDock from '@/components/ui/minimal-dock';

type UserProfile = { id: string; email?: string; user_metadata?: any };

export default function Profile() {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const returnTo = encodeURIComponent('/profile');
        window.location.assign(`/dashabi/login?returnTo=${returnTo}`);
        return;
      }
      setUser({ id: user.id, email: user.email || '', user_metadata: user.user_metadata });
      setDisplayName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    })();
  }, []);

  const saveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: displayName,
          avatar_url: avatarUrl
        }
      });
      if (error) throw error;
      setMessage('Profile updated');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!newPassword) return;
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      setMessage('Password changed');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold">Profile</h1>
        {message && <div className="mt-4 rounded border border-white/20 bg-white/10 px-3 py-2 text-sm">{message}</div>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Display Name</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-md p-2 bg-black/30 border border-white/20" />
              </div>
              <div>
                <label className="block text-sm mb-1">Avatar URL</label>
                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full rounded-md p-2 bg-black/30 border border-white/20" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60">Save</button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-md p-2 bg-black/30 border border-white/20" />
              <button onClick={changePassword} disabled={saving || !newPassword} className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-60">Update Password</button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold mb-4">Saved Jobs</h2>
          <p className="text-white/70">Coming soon...</p>
        </div>
      </div>
      <MinimalistDock />
    </div>
  );
}


