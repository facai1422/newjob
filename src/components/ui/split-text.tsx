import { useSprings, animated, easings } from '@react-spring/web';
import React, { useEffect, useRef, useState } from 'react';

export interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: React.CSSProperties;
  animationTo?: React.CSSProperties;
  easing?: keyof typeof easings | 'linear' | string;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  onLetterAnimationComplete?: () => void;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'easeOutCubic',
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) => {
  const words = text.split(' ').map((word) => word.split(''));
  const letters = words.flat();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const easingFn = (typeof easing === 'string' && (easings as any)[easing]) || undefined;

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: animationFrom,
      to: inView
        ? async (next) => {
            await next(animationTo);
            animatedCount.current += 1;
            if (animatedCount.current === letters.length && onLetterAnimationComplete) {
              onLetterAnimationComplete();
            }
          }
        : animationFrom,
      delay: i * delay,
      config: easingFn ? { duration: 500, easing: easingFn } : { tension: 170, friction: 26 },
    }))
  );

  const textStyle: React.CSSProperties = {
    textAlign,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  };

  return (
    <p ref={ref} className={`split-parent overflow-hidden inline text-white ${className}`} style={textStyle}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.map((letter, letterIndex) => {
            const index = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + letterIndex;
            return (
              <animated.span
                key={index}
                style={springs[index] as any}
                className="inline-block will-change-transform"
              >
                {letter}
              </animated.span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>}
        </span>
      ))}
    </p>
  );
};


