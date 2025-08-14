import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Users, Award, TrendingUp, MapPin } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
// import { HomeCarousel } from './components/HomeCarousel';
import { ResumeForm } from './components/ResumeForm'; 
import { JobDetails } from './components/JobDetails';
import { LocationJobs } from './pages/LocationJobs';
import { MyResume } from './pages/MyResume';
import { AuthForm } from './components/AuthForm';
import { AdminDashboard } from './pages/AdminDashboard';
import Locations from './pages/Locations';
import { supabase } from './lib/supabase';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { GeometricBackground } from '@/components/ui/geometric-background';
import { RevealText } from '@/components/ui/reveal-text';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Component as ImageAutoSlider } from '@/components/ui/image-auto-slider';
import RealismButton from '@/components/ui/realism-button';
import LogoutFab from '@/components/ui/logout-fab';
import { Footer as NewFooter } from '@/components/ui/footer-section';
import MinimalistDock from '@/components/ui/minimal-dock';
import Testimonials from './pages/Testimonials';
import Profile from './pages/Profile';
// import { Globe as GlobeCanvas } from '@/components/ui/globe';
// import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { LazyMount } from '@/components/ui/lazy-mount';

interface JobLocation {
  id: number;
  nameKey: string;
  image: string;
  jobCount: number;
}

function App() {
  const { t } = useLanguage();
  // removed perf gating for hero/whyUs titles
  // 移除顶部下拉菜单，直接在页头展示操作
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [hasResume, setHasResume] = React.useState(false);
  
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
  

  React.useEffect(() => {
    checkAuth();
    
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
        <Route path="/locations" element={<Locations />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/profile" element={<Profile />} />
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

              {/* Hero 区域：移除搜索后，上移并保留顶部留白避免被导航遮挡 */}
              <div className="pt-24 md:pt-28 lg:pt-32">
                <HeroGeometric compact className="!bg-transparent" badge="Hirely" title1={t('hero.title')} title2={t('hero.subtitle')} />
              </div>
              <LazyMount 
              className="relative z-10 mt-6 md:mt-8 lg:mt-10 [content-visibility:auto] [contain-intrinsic-size:1px_400px]"
              height="400px"
              fallback={
                <div className="h-[400px] bg-black/40 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-white/60">加载中...</div>
                </div>
              }
            >
              <ImageAutoSlider />
            </LazyMount>
            </div>

            {/* Featured section removed per requirement */}

            {/* 工作地点区域已迁移至 /locations 页面，通过底部导航第二个按钮进入 */}

            <LazyMount
              height="600px"
              fallback={
                <section className="py-12">
                  <div className="container mx-auto px-4">
                    <div className="mb-8 flex justify-center">
                      <div className="h-12 bg-white/20 rounded w-64 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="relative h-full rounded-[1.25rem] border border-white/10 p-2 md:rounded-[1.5rem] md:p-3">
                          <div className="relative flex h-full flex-col items-center justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60 p-8 text-center">
                            <div className="w-16 h-16 rounded-xl bg-white/20 animate-pulse" />
                            <div className="space-y-2 w-full">
                              <div className="h-6 bg-white/20 rounded w-3/4 mx-auto animate-pulse" />
                              <div className="h-4 bg-white/15 rounded w-full animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              }
            >
            <section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_600px]">
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
            </LazyMount>

            <LazyMount
              height="400px"
              fallback={
                <div className="mt-16 bg-black/40 p-8">
                  <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                          <div className="h-5 bg-white/20 rounded w-3/4 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-3 bg-white/15 rounded w-full animate-pulse" />
                            <div className="h-3 bg-white/15 rounded w-2/3 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <div className="mt-16 [content-visibility:auto] [contain-intrinsic-size:1px_400px]">
                <NewFooter />
              </div>
            </LazyMount>
            <MinimalistDock />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;