import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Building2, Users, BriefcaseIcon, ArrowRight, Globe, Award, TrendingUp, MessageCircle, MapPin } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
// import { HomeCarousel } from './components/HomeCarousel';
import { ResumeForm } from './components/ResumeForm'; 
import { JobDetails } from './components/JobDetails';
import { LocationJobs } from './pages/LocationJobs';
import { MyResume } from './pages/MyResume';
import { AuthForm } from './components/AuthForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { supabase } from './lib/supabase';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { GeometricBackground } from '@/components/ui/geometric-background';
import SearchComponent from '@/components/ui/animated-glowing-search-bar';
import { RevealText } from '@/components/ui/reveal-text';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import ImageAutoSlider from '@/components/ui/image-auto-slider';
import RealismButton from '@/components/ui/realism-button';
import LogoutFab from '@/components/ui/logout-fab';
import { Footer as NewFooter } from '@/components/ui/footer-section';
// import { Globe as GlobeCanvas } from '@/components/ui/globe';

interface JobLocation {
  id: number;
  nameKey: string;
  image: string;
  jobCount: number;
}

function App() {
  const { t } = useLanguage();
  // 移除顶部下拉菜单，直接在页头展示操作
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [hasResume, setHasResume] = React.useState(false);
  interface Job {
    id: string;
    title: string;
    salary: string;
    working_hours: string;
  }
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState('');
  const [jobLocations, setJobLocations] = React.useState<JobLocation[]>([
    {
      id: 1,
      nameKey: 'locations.ghana',
      image: 'https://cy-747263170.imgix.net/%E5%8A%A0%E7%BA%B3.png',
      jobCount: 0
    },
    {
      id: 2,
      nameKey: 'locations.cambodia',
      image: 'https://cy-747263170.imgix.net/%E6%9F%AC%E5%9F%94%E5%AF%A8.png',
      jobCount: 0
    },
    {
      id: 3,
      nameKey: 'locations.malaysia',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      jobCount: 0
    },
    {
      id: 4,
      nameKey: 'locations.indonesia',
      image: 'https://cy-747263170.imgix.net/%E5%8D%B0%E5%BA%A6%E5%B0%BC%E8%A5%BF%E4%BA%9A.png',
      jobCount: 0
    },
    {
      id: 5,
      nameKey: 'locations.myanmar',
      image: 'https://cy-747263170.imgix.net/%E7%BC%85%E7%94%B8.png',
      jobCount: 0
    },
    {
      id: 6,
      nameKey: 'locations.dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      jobCount: 0
    },
    {
      id: 7,
      nameKey: 'locations.oman',
      image: 'https://cy-747263170.imgix.net/%E9%98%BF%E6%9B%BC.png',
      jobCount: 0
    },
    {
      id: 8,
      nameKey: 'locations.philippines',
      image: 'https://cy-747263170.imgix.net/%E8%8F%B2%E5%BE%8B%E5%AE%BE.png',
      jobCount: 0
    }
  ]);
  const [customerService, setCustomerService] = React.useState({
    whatsapp_link: '',
    telegram_link: ''
  });

  React.useEffect(() => {
    checkAuth();
    fetchJobs();
    fetchCustomerService();
    fetchJobCounts();
    supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        void checkHasResume();
      } else {
        setHasResume(false);
      }
    });

    const handleResumeSubmitted = () => setHasResume(true);
    window.addEventListener('resume:submitted', handleResumeSubmitted);
    return () => {
      window.removeEventListener('resume:submitted', handleResumeSubmitted);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    if (session) {
      await checkHasResume();
    }
  };

  const checkHasResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasResume(false);
        return;
      }
      const { data, error } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      if (error) throw error;
      setHasResume(!!(data && data.length > 0));
    } catch (e) {
      setHasResume(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      let query = supabase.from('jobs').select('*');

      // 搜索标题、描述和标签
      if (search && search.trim()) {
        const kw = search.trim();
        query = query.or(
          `title.ilike.%${kw}%,description.ilike.%${kw}%,tags.cs.{${kw}}`
        );
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    finally {
      setJobsLoading(false);
    }
  };

  const doSearch = async () => {
    await fetchJobs();
  };

  const fetchJobCounts = async () => {
    try {
      const { data } = await supabase
        .from('location_infos')
        .select('location_key,vacancy_count');

      const counts: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        counts[row.location_key] = row.vacancy_count || 0;
      });

      const updated = jobLocations.map((loc) => ({
        ...loc,
        jobCount: counts[t(loc.nameKey)] || loc.jobCount
      }));
      setJobLocations(updated);
    } catch (error) {
      console.error('Error fetching job counts:', error);
    }
  };

  const fetchCustomerService = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_service_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching customer service settings:', error);
        return;
      }
      
      if (data) {
        setCustomerService({
          whatsapp_link: data.whatsapp_link || '',
          telegram_link: data.telegram_link || ''
        });
      }
    } catch (error) {
      console.error('Error fetching customer service settings:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/submit-resume" element={<ResumeForm />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/location/:location" element={<LocationJobs />} />
        <Route path="/dashabi/login" element={<AuthForm />} />
        <Route path="/my-resume" element={<MyResume />} />
        <Route path="/dashabi/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={
          <div className="min-h-screen">
            <GeometricBackground />
            <div className="relative">
              <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10">
                <nav className="container mx-auto px-4 py-4 text-white">
                  <div className="flex items-center justify-between">
                    {/* 左侧：将 Logo 去掉，直接放语言切换图标与主操作 */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-6">
                      {/* 头部红框区域：语言切换 + 提交/我的简历 */}
                      <div className="flex items-center gap-2 md:gap-4 text-sm md:text-xs">
                        <div className="shrink-0"><LanguageSelector /></div>
                        {hasResume ? (
                          <Link to="/my-resume" aria-label="My Resume" className="inline-block">
                            <RealismButton text={t('resume.myResume')} />
                          </Link>
                        ) : (
                          <Link to="/submit-resume" aria-label="Submit Resume" className="inline-block">
                            <RealismButton text={t('resume.submitTitle')} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* 右侧：登录/退出按钮，替换原来的下拉菜单图标 */}
                    <div className="flex items-center gap-3">
                      {isLoggedIn ? (
                        <LogoutFab onClick={handleLogout} />
                      ) : (
                        <Link to="/dashabi/login" aria-label="Login" className="super-button">
                          <span>{t('auth.login')}</span>
                          <svg fill="none" viewBox="0 0 24 24" className="arrow">
                            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </nav>
              </div>

              {/* 搜索框位置：避开顶部导航与按钮区域 */}
              <div className="pt-24 md:pt-28 lg:pt-32">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex flex-col items-center gap-3 max-w-4xl mx-auto">
                    <SearchComponent
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
                      placeholder={t('hero.searchPlaceholder')}
                    />
                    <button
                      onClick={doSearch}
                      className="bg-slate-800 h-[56px] z-10 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-sm font-semibold leading-6 text-white inline-flex items-center justify-center"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <span className="relative inline-flex items-center justify-center h-[52px] px-6 rounded-full bg-zinc-950 ring-1 ring-white/10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 via-neutral-600 to-neutral-300">
                          {t('hero.searchButton')}
                        </span>
                      </span>
                    </button>
                    {/* 地球效果已移除 */}
                  </div>
                </div>
              </div>
              {/* Hero 文本放到搜索框下，轮播图在其下方 */}
              <div className="pt-4">
                <HeroGeometric compact className="!bg-transparent" badge="Hirely" title1={t('hero.title')} title2={t('hero.subtitle')} />
              </div>
              <div className="relative z-10 mt-6 md:mt-8 lg:mt-10">
                <ImageAutoSlider className="h-64 md:h-80 lg:h-[28rem]" />
              </div>
            </div>

            {/* 原搜索区块已上移，此处移除 */}

            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="sr-only">{t('featured.title')}</h2>
                <div className="mb-8 flex justify-center">
                  <RevealText
                    text={t('featured.title')}
                    textColor="text-white"
                    overlayColor="text-indigo-400"
                    fontSize="text-3xl md:text-5xl"
                    letterDelay={0.06}
                    overlayDelay={0.04}
                    overlayDuration={0.35}
                    springDuration={500}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [content-visibility:auto] [contain-intrinsic-size:1px_600px]">
                  {jobsLoading && Array.from({ length: 6 }).map((_, i) => (
                    <div key={`s-${i}`} className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-4">
                        <div className="w-full h-44 bg-white/10 rounded-lg mb-4 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-2/3 bg-white/10 rounded" />
                          <div className="h-4 w-1/3 bg-white/10 rounded" />
                        </div>
                        <div className="mt-4 h-10 bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                  {!jobsLoading && jobs.map((job: any) => (
                    <div key={job.id} className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-white">{job.title}</h3>
                            <p className="text-white/80">{job.salary}</p>
                          </div>
                          <BriefcaseIcon className="h-6 w-6 text-blue-300" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-white/70 flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            {job.working_hours}
                          </p>
                        </div>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="mt-4 w-full bg-white/10 text-white py-2 rounded flex items-center justify-center hover:bg-white/20 border border-white/10"
                        >
                          {t('featured.viewDetails')}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="sr-only">{t('locations.title')}</h2>
                <div className="mb-8 flex justify-center">
                  <RevealText
                    text={t('locations.title')}
                    textColor="text-white"
                    overlayColor="text-indigo-400"
                    fontSize="text-2xl md:text-4xl"
                    letterDelay={0.06}
                    overlayDelay={0.04}
                    overlayDuration={0.35}
                    springDuration={500}
                  />
                </div>
                <div className="flex flex-col gap-6">
                  {jobLocations.map((location) => (
                    <div key={location.id} className="border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl">
                      <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900">
                        <Link
                          to={`/jobs/location/${encodeURIComponent(t(location.nameKey))}`}
                          className="block h-64 w-full relative group"
                          aria-label={`View jobs in ${t(location.nameKey)}`}
                        >
                          <img
                            src={location.image}
                            alt={t(location.nameKey)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">{t(location.nameKey)}</h3>
                            <div className="flex items-center text-white/90">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{location.jobCount} {t('locations.openings')}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="sr-only">{t('whyUs.title')}</h2>
                <div className="mb-8 flex justify-center">
                  <RevealText
                    text={t('whyUs.title')}
                    textColor="text-white"
                    overlayColor="text-indigo-400"
                    fontSize="text-2xl md:text-4xl"
                    letterDelay={0.06}
                    overlayDelay={0.04}
                    overlayDuration={0.35}
                    springDuration={500}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[{
                    icon: Users,
                    title: t('whyUs.topCompanies.title'),
                    desc: t('whyUs.topCompanies.desc'),
                  }, {
                    icon: Award,
                    title: t('whyUs.qualityPositions.title'),
                    desc: t('whyUs.qualityPositions.desc'),
                  }, {
                    icon: TrendingUp,
                    title: t('whyUs.careerGrowth.title'),
                    desc: t('whyUs.careerGrowth.desc'),
                  }].map((item, idx) => (
                    <div key={idx} className="relative h-full rounded-[1.25rem] border border-white/10 p-2 md:rounded-[1.5rem] md:p-3">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={2}
                      />
                      <div className="relative flex h-full flex-col items-center justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60 p-8 text-center">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20 flex items-center justify-center">
                          <item.icon className="h-8 w-8 text-blue-300" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl md:text-2xl font-semibold text-white">{item.title}</h3>
                          <p className="text-white/80">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="mt-16">
              <NewFooter />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;