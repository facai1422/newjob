import { useSprings, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: object; 
  animationTo?: object; 
  easing?: string; 
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  onLetterAnimationComplete?: () => void;
}

export const SplitText = ({ 
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
}: SplitTextProps) => {
  const words = text.split(' ').map(word => word.split(''));
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
        if (currentRef) { 
            observer.unobserve(currentRef);
        }
        observer.disconnect();
    };
  }, [threshold, rootMargin]);

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
      config: { easing }, 
    }))
  );


  const getTextAlignClass = () => {
    switch (textAlign) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center': return 'text-center';
      case 'justify': return 'text-justify';
      default: return 'text-center';
    }
  };

  return (
    <div
      ref={ref}
      className={`split-parent overflow-hidden block normal-case break-words whitespace-normal ${getTextAlignClass()} ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-1">
          {word.map((letter, letterIndex) => {
           
            const index = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + letterIndex;

            return (
              <animated.span
                key={index} 
                style={springs[index]}
                className="inline-block transform transition-opacity will-change-transform" 
              >
                {letter}
              </animated.span>
            );
          })}
        </span>
      ))}
    </div>
  );
};