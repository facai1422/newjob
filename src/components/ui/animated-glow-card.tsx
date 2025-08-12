import React from 'react';
import { cn } from '@/lib/utils';

type WithChildren = {
  children?: React.ReactNode;
  className?: string;
};

const CardCanvas: React.FC<WithChildren> = ({ children, className = '' }) => {
  return (
    <div className={cn('card-canvas relative', className)}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0" />
        </filter>
      </svg>
      <div className="card-backdrop" />
      {children}
    </div>
  );
};

const Card: React.FC<WithChildren> = ({ children, className = '' }) => {
  return (
    <div className={cn('glow-card relative', className)}>
      <div className="border-element border-left" />
      <div className="border-element border-right" />
      <div className="border-element border-top" />
      <div className="border-element border-bottom" />
      <div className="card-content relative z-[1]">{children}</div>
    </div>
  );
};

export { CardCanvas, Card };


