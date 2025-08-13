import React from 'react';

export function usePerf() {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [lowEndDevice, setLowEndDevice] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  React.useEffect(() => {
    const mem = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isLow = mem <= 4 || cores <= 4;
    setLowEndDevice(isLow);
  }, []);

  return { reducedMotion, lowEndDevice };
}

export function useInView<T extends Element>(rootMargin: string = '0px') {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView } as const;
}


