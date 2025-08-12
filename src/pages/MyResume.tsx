import React from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { GeometricBackground } from '@/components/ui/geometric-background';
import { Mail, Phone, GraduationCap, Briefcase, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export function MyResume() {
  const { t } = useLanguage();
  const [resume, setResume] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', session.user.id)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        setResume(data);
      } catch (e: any) {
        setError(e?.message || 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
      <GeometricBackground />
      <div className="relative z-10 p-6 text-white">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
      <GeometricBackground />
      <div className="relative z-10 p-6 text-red-200">{error}</div>
    </div>
  );

  if (!resume) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
        <GeometricBackground />
        <div className="relative z-10 p-6 text-white">No resume found.</div>
      </div>
    );
  }

  const statusMap: Record<string, string> = {
    pending: t('resume.statusPending'),
    approved: t('resume.statusApproved'),
    rejected: t('resume.statusRejected')
  };
  const statusStyle: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
    approved: 'bg-green-500/15 text-green-300 ring-1 ring-green-400/30',
    rejected: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30',
  };
  const StatusIcon: Record<string, React.ComponentType<any>> = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const parseSkills = (str?: string): string[] => {
    if (!str) return [];
    return str
      .split(/[,，、;；\n|]/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
      <GeometricBackground />
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <div className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-10 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{resume.fullName || t('resume.myResume')}</h1>
                <div className="mt-2 flex items-center gap-4 text-white/80">
                  {resume.email && (
                    <div className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{resume.email}</div>
                  )}
                  {resume.phone && (
                    <div className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />{resume.phone}</div>
                  )}
                </div>
              </div>
              <div>
                {(() => {
                  const Icon = StatusIcon[resume.status] || Clock;
                  return (
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyle[resume.status] || statusStyle.pending}`}>
                      <Icon className="h-4 w-4" />{statusMap[resume.status] || resume.status}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {resume.education && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-blue-300" />
                      <h2 className="text-lg font-semibold">{t('resume.education')}</h2>
                    </div>
                    <p className="text-white/80 whitespace-pre-line leading-relaxed">{resume.education}</p>
                  </div>
                )}
                {resume.skills && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-300" />
                      <h2 className="text-lg font-semibold">{t('resume.skills')}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parseSkills(resume.skills).map((s, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs border border-white/10">{s}</span>
                      ))}
                      {parseSkills(resume.skills).length === 0 && (
                        <p className="text-white/80">{resume.skills}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {resume.experience && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-blue-300" />
                      <h2 className="text-lg font-semibold">{t('resume.experience')}</h2>
                    </div>
                    <p className="text-white/80 whitespace-pre-line leading-relaxed">{resume.experience}</p>
                  </div>
                )}
                {resume.coverLetter && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-300" />
                      <h2 className="text-lg font-semibold">{t('resume.coverLetter')}</h2>
                    </div>
                    <p className="text-white/80 whitespace-pre-line leading-relaxed">{resume.coverLetter}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




