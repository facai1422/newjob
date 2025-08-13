"use client";

import React, { useState } from 'react';
import { MapPin, Users, DollarSign, Building2, Calendar, Award, Play, Eye } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/i18n/LanguageContext';

export type JobPosition = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  openings?: number;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  rewards?: string[];
  imageUrl?: string;
  videoUrl?: string;
  postedDate?: string;
  companyLogo?: string;
};

type JobListingProps = { jobs: JobPosition[] };

const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border border-white/20 text-white/90 ${className}`}>
    {children}
  </span>
);

const Button = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`inline-flex items-center justify-center rounded-md px-3 py-2 bg-white/10 text-white hover:bg-white/20 border border-white/10 transition ${className}`}>
    {children}
  </button>
);

const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string } > = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-white/10 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-white/10 text-xl font-bold">{title}</div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

const JobCard: React.FC<{ job: JobPosition; onView: () => void }> = ({ job, onView }) => {
  const { t } = useLanguage();
  return (
    <div className="group bg-zinc-900/70 border border-white/10 rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition">
      <div className="relative overflow-hidden">
        {job.imageUrl && (
          <img src={job.imageUrl} alt={job.company || job.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        {job.videoUrl && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-10 h-10 text-white" />
          </div>
        )}
        {job.type && (
          <div className="absolute top-3 right-3"><Badge className="bg-white/10">{job.type}</Badge></div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-white text-lg font-semibold mb-1">{job.title}</h3>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              {job.companyLogo && (<img src={job.companyLogo} alt={job.company} className="w-5 h-5 rounded-full object-cover" />)}
              <span>{job.company}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">{job.salary}</div>
            <div className="text-xs text-white/60">{t('job.salary')}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-white/70">
          {job.location && <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
          {typeof job.openings === 'number' && <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" />招{job.openings}人</span>}
          {job.postedDate && <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{job.postedDate}</span>}
        </div>
        {job.description && <p className="mt-3 text-sm text-white/70 line-clamp-2">{job.description}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {(job.benefits || []).slice(0,3).map((b, i) => <Badge key={i} className="text-xs">{b}</Badge>)}
          {job.benefits && job.benefits.length > 3 && <Badge className="text-xs">+{job.benefits.length - 3}</Badge>}
        </div>
        <Button onClick={onView} className="w-full mt-4"><Eye className="w-4 h-4 mr-2" /> {t('featured.viewDetails')}</Button>
      </div>
    </div>
  );
};

export const JobListing: React.FC<JobListingProps> = ({ jobs }) => {
  const [open, setOpen] = useState(false);
  const [job, setJob] = useState<JobPosition | null>(null);
  const { t } = useLanguage();

  const view = (j: JobPosition) => { setJob(j); setOpen(true); };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {jobs.map((j) => (
          <JobCard key={j.id} job={j} onView={() => view(j)} />
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={job?.title}>
        {job && (
          <div className="space-y-6">
            {job.imageUrl && (
              <div className="relative overflow-hidden rounded-lg">
                <img src={job.imageUrl} alt={job.company || ''} className="w-full h-64 object-cover" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-blue-300" /><div><div className="font-semibold">{job.company}</div><div className="text-sm text-white/60">公司名称</div></div></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-blue-300" /><div><div className="font-semibold">{job.location}</div><div className="text-sm text-white/60">工作地点</div></div></div>
                <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-blue-300" /><div><div className="font-semibold">{job.salary}</div><div className="text-sm text-white/60">薪资待遇</div></div></div>
                <div className="flex items-center gap-3"><Users className="w-5 h-5 text-blue-300" /><div><div className="font-semibold">招聘{job.openings}人</div><div className="text-sm text-white/60">招聘人数</div></div></div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-blue-300" />岗位要求</h4>
                  <ul className="space-y-1 text-sm text-white/70">
                    {(job.requirements || []).map((r, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="w-1 h-1 bg-blue-300 rounded-full mt-2" />{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {job.description && (<div><h4 className="font-semibold mb-2">岗位描述</h4><p className="text-white/70 leading-relaxed">{job.description}</p></div>)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><h4 className="font-semibold mb-2">福利待遇</h4><div className="flex flex-wrap gap-2">{(job.benefits || []).map((b,i)=>(<Badge key={i}>{b}</Badge>))}</div></div>
              <div><h4 className="font-semibold mb-2">奖励制度</h4><div className="flex flex-wrap gap-2">{(job.rewards || []).map((b,i)=>(<Badge key={i} className="border border-white/20">{b}</Badge>))}</div></div>
            </div>
            <div className="flex gap-3 pt-2"><Button className="flex-1">{t('job.apply')}</Button><Button className="flex-1">{t('job.save')}</Button></div>
          </div>
        )}
      </Modal>
    </div>
  );
};


