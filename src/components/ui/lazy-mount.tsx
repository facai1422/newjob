import React from 'react';

type LazyMountProps = {
  children: React.ReactNode;
  rootMargin?: string;
  once?: boolean;
  className?: string;
};

export function LazyMount({ children, rootMargin = '200px', once = true, className }: LazyMountProps) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return <div ref={ref} className={className}>{visible ? children : null}</div>;
}


