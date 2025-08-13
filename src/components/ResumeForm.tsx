"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, FileText, ChevronDown, ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GeometricBackground } from '@/components/ui/geometric-background';
import { useLanguage } from '../i18n/LanguageContext';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants = {
  default: "bg-white text-black hover:bg-gray-100",
  outline: "border border-gray-600 bg-transparent text-white hover:bg-gray-800",
  ghost: "bg-transparent text-white hover:bg-gray-800"
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-lg border border-gray-600 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-lg border border-gray-600 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { children: React.ReactNode; }
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full appearance-none rounded-lg border border-gray-600 bg-black/50 px-3 py-2 pr-8 text-sm text-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
));
Select.displayName = "Select";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));
Label.displayName = "Label";

interface UseFileUploadProps {
  onUpload?: (file: File) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

function useFileUpload({ onUpload, maxSize = 10 * 1024 * 1024, allowedTypes }: UseFileUploadProps = {}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    if (allowedTypes && !allowedTypes.some(type => file.type.includes(type))) {
      setError('不支持的文件类型');
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    onUpload?.(file);
  }, [onUpload, maxSize, allowedTypes]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const triggerFileSelect = useCallback(() => { fileInputRef.current?.click(); }, []);

  return { fileInputRef, selectedFile, previewUrl, error, isDragging, handleFileChange, handleDrop, handleDragOver, handleDragLeave, handleRemove, triggerFileSelect };
}

interface FileUploadProps { onFileSelect?: (file: File) => void; maxSize?: number; allowedTypes?: string[]; className?: string; }
function FileUpload({ onFileSelect, maxSize, allowedTypes, className }: FileUploadProps) {
  const { fileInputRef, selectedFile, previewUrl, error, isDragging, handleFileChange, handleDrop, handleDragOver, handleDragLeave, handleRemove, triggerFileSelect } = useFileUpload({ onUpload: onFileSelect, maxSize, allowedTypes });
  return (
    <div className={cn("space-y-4", className)}>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept={allowedTypes?.join(',')} aria-label="上传简历" title="上传简历" />
      {!selectedFile ? (
        <motion.div onClick={triggerFileSelect} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={cn("border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400", isDragging && "border-white bg-white/5")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-white mb-2">点击上传简历或拖拽文件到此处</p>
          <p className="text-gray-400 text-sm">支持 PDF、DOC、DOCX 格式，最大 10MB</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-gray-600 rounded-lg p-4 bg-black/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {previewUrl ? (
                <img src={previewUrl} alt="预览" className="w-12 h-12 object-cover rounded" />
              ) : (
                <File className="h-12 w-12 text-gray-400" />
              )}
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
      {error && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">{error}</motion.p>)}
    </div>
  );
}

interface FormData {
  resume: File | null;
  country: string;
  name: string;
  education: string;
  email: string;
  phone: string;
  position: string;
  introduction: string;
  experience: string;
  skills: string;
}

export function ResumeForm() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    resume: null,
    country: '',
    name: '',
    education: '',
    email: '',
    phone: '',
    position: '',
    introduction: '',
    experience: '',
    skills: ''
  });

  React.useEffect(() => { (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/dashabi/login', { state: { returnTo: '/submit-resume' } });
      return;
    }
    setIsAuthenticated(true);
  })(); }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const handleInputChange = (field: keyof FormData, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleFileSelect = (file: File) => setFormData(prev => ({ ...prev, resume: file }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/dashabi/login', { state: { returnTo: '/submit-resume' } });
        return;
      }
      const combinedCover = `国家/地区: ${formData.country}\n申请职位: ${formData.position}\n个人介绍: ${formData.introduction}`;
      const { error } = await supabase.from('resumes').insert({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        experience: formData.experience,
        skills: formData.skills,
        coverLetter: combinedCover,
        user_id: session.user.id,
        status: 'pending',
        submitted_at: new Date().toISOString()
      });
      if (error) throw error;
      setSubmitSuccess(true);
      window.dispatchEvent(new Event('resume:submitted'));
      setTimeout(() => { setSubmitSuccess(false); navigate('/my-resume'); }, 1200);
    } catch (err: any) {
      setSubmitError(err?.message || t('auth.genericError'));
    } finally { setIsSubmitting(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <GeometricBackground />
        <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10 h-14" />
      </div>
    );
  }

  const countries = React.useMemo(() => {
    const map: Record<string, string[]> = {
      zh: ['中国', '美国', '英国', '加拿大', '澳大利亚', '德国', '法国', '日本', '韩国', '新加坡', '其他'],
      en: ['China', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'South Korea', 'Singapore', 'Other'],
      es: ['China', 'Estados Unidos', 'Reino Unido', 'Canadá', 'Australia', 'Alemania', 'Francia', 'Japón', 'Corea del Sur', 'Singapur', 'Otro'],
      pt: ['China', 'Estados Unidos', 'Reino Unido', 'Canadá', 'Austrália', 'Alemanha', 'França', 'Japão', 'Coreia do Sul', 'Cingapura', 'Outro'],
      fr: ['Chine', 'États‑Unis', 'Royaume‑Uni', 'Canada', 'Australie', 'Allemagne', 'France', 'Japon', 'Corée du Sud', 'Singapour', 'Autre'],
      de: ['China', 'Vereinigte Staaten', 'Vereinigtes Königreich', 'Kanada', 'Australien', 'Deutschland', 'Frankreich', 'Japan', 'Südkorea', 'Singapur', 'Andere'],
      ar: ['الصين', 'الولايات المتحدة', 'المملكة المتحدة', 'كندا', 'أستراليا', 'ألمانيا', 'فرنسا', 'اليابان', 'كوريا الجنوبية', 'سنغافورة', 'أخرى'],
      ja: ['中国', 'アメリカ合衆国', 'イギリス', 'カナダ', 'オーストラリア', 'ドイツ', 'フランス', '日本', '韓国', 'シンガポール', 'その他'],
      hi: ['चीन', 'संयुक्त राज्य', 'यूनाइटेड किंगडम', 'कनाडा', 'ऑस्ट्रेलिया', 'जर्मनी', 'फ्रांस', 'जापान', 'दक्षिण कोरिया', 'सिंगापुर', 'अन्य'],
      km: ['ចិន', 'សហរដ្ឋអាមេរិក', 'ចក្រភពអង់គ្លេស', 'កាណាដា', 'អូស្ត្រាលី', 'អាល្លឺម៉ង់', 'បារាំង', 'ជប៉ុន', 'កូរ៉េ​ទាក់​ខាង​ត្បូង', 'សិង្ហបុរី', 'ផ្សេងៗ']
    };
    return map[language] || map.zh;
  }, [language]);

  const educationLevels = React.useMemo(() => {
    const map: Record<string, string[]> = {
      zh: ['高中', '大专', '本科', '硕士', '博士', '其他'],
      en: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'Other'],
      es: ['Secundaria', 'Técnico', 'Licenciatura', 'Maestría', 'Doctorado', 'Otro'],
      pt: ['Ensino médio', 'Tecnólogo', 'Bacharelado', 'Mestrado', 'Doutorado', 'Outro'],
      fr: ['Lycée', 'Licence pro', 'Licence', 'Master', 'Doctorat', 'Autre'],
      de: ['Abitur', 'Fachhochschule', 'Bachelor', 'Master', 'Doktor', 'Andere'],
      ar: ['ثانوية', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', 'أخرى'],
      ja: ['高校', '短大', '学士', '修士', '博士', 'その他'],
      hi: ['हाई स्कूल', 'डिप्लोमा', 'स्नातक', 'स्नातकोत्तर', 'पीएचडी', 'अन्य'],
      km: ['វិទ្យាល័យ', 'បរិញ្ញាបត្ររង', 'បរិញ្ញាបត្រ', 'អនុបណ្ឌិត', 'បណ្ឌិត', 'ផ្សេងៗ']
    };
    return map[language] || map.zh;
  }, [language]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white">
            <ArrowLeft className="h-5 w-5 mr-2" /> {t('nav.back')}
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center text-white/80 hover:text-white">
            <LogOut className="h-5 w-5 mr-2" /> 退出登录
          </button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{t('resume.submitTitle')}</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-300 max-w-2xl mx-auto">{t('resume.formSubtitle')}</motion.p>
          </div>

          {submitError && (
            <div className="mb-4 bg-red-500/15 text-red-200 border border-red-400/40 px-4 py-3 rounded text-sm">
              {submitError}
            </div>
          )}

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={onSubmit} className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2"><FileText className="h-4 w-4" /><span>{t('resume.upload')} *</span></Label>
              <FileUpload onFileSelect={handleFileSelect} maxSize={10 * 1024 * 1024} allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label className="flex items-center space-x-2"><MapPin className="h-4 w-4" /><span>{t('resume.country')} *</span></Label>
                <Select value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} required>
                  <option value="">{t('resume.selectCountry')}</option>
                  {countries.map(c => (<option key={c} value={c}>{c}</option>))}
                </Select>
              </div>
              <div className="space-y-2"><Label className="flex items-center space-x-2"><User className="h-4 w-4" /><span>{t('resume.fullName')} *</span></Label>
                <Input type="text" placeholder={t('resume.placeholderName')} value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
              </div>
              <div className="space-y-2"><Label className="flex items-center space-x-2"><GraduationCap className="h-4 w-4" /><span>{t('resume.education')} *</span></Label>
                <Select value={formData.education} onChange={(e) => handleInputChange('education', e.target.value)} required>
                  <option value="">{t('resume.selectDegree')}</option>
                  {educationLevels.map(level => (<option key={level} value={level}>{level}</option>))}
                </Select>
              </div>
              <div className="space-y-2"><Label className="flex items-center space-x-2"><Mail className="h-4 w-4" /><span>{t('resume.email')} *</span></Label>
                <Input type="email" placeholder={t('resume.placeholderEmail')} value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
              </div>
              <div className="space-y-2"><Label className="flex items-center space-x-2"><Phone className="h-4 w-4" /><span>{t('resume.phone')} *</span></Label>
                <Input type="tel" placeholder={t('resume.placeholderPhone')} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required />
              </div>
              <div className="space-y-2"><Label className="flex items-center space-x-2"><Briefcase className="h-4 w-4" /><span>{t('resume.position')} *</span></Label>
                <Input type="text" placeholder={t('resume.selectPosition')} value={formData.position} onChange={(e) => handleInputChange('position', e.target.value)} required />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2"><Label>{t('resume.introduction')} *</Label>
                <Textarea placeholder={t('resume.placeholderIntroduction')} value={formData.introduction} onChange={(e) => handleInputChange('introduction', e.target.value)} rows={4} required />
              </div>
              <div className="space-y-2"><Label>{t('resume.experience')} *</Label>
                <Textarea placeholder={t('resume.placeholderExperience')} value={formData.experience} onChange={(e) => handleInputChange('experience', e.target.value)} rows={5} required />
              </div>
              <div className="space-y-2"><Label className="flex items-center space-x-2"><Award className="h-4 w-4" /><span>{t('resume.skillsAwards')}</span></Label>
                <Textarea placeholder={t('resume.placeholderSkills')} value={formData.skills} onChange={(e) => handleInputChange('skills', e.target.value)} rows={4} />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-semibold">
                {isSubmitting ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />) : (t('resume.submit'))}
              </Button>
            </div>
          </motion.form>

          <AnimatePresence>
            {submitSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                <div className="bg-black border border-gray-800 rounded-2xl p-8 text-center max-w-md mx-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">申请提交成功！</h3>
                  <p className="text-gray-300">我们会尽快审核您的申请并与您联系</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}