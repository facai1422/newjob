import React from 'react';
import { cn } from '@/lib/utils';

type RealismButtonProps = {
  text: string;
  className?: string;
};

export const RealismButton: React.FC<RealismButtonProps> = ({ text, className }) => {
  return (
    <div className={cn('inline-block', className)}>
      <style>{`
        .realism-button { cursor:pointer; font-size:1.1rem; border-radius:16px; border:none; padding:2px; background: radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b); position:relative; }
        .realism-button::after { content:""; position:absolute; width:65%; height:60%; border-radius:120px; top:0; right:0; box-shadow:0 0 20px #ffffff38; z-index:-1; }
        .realism-blob1 { position:absolute; width:70px; height:100%; border-radius:16px; bottom:0; left:0; background: radial-gradient(circle 60px at 0% 100%, #3fe9ff, #0000ff80, transparent); box-shadow:-10px 10px 30px #0051ff2d; }
        .realism-inner { padding:10px 18px; border-radius:14px; color:#fff; z-index:3; position:relative; background: radial-gradient(circle 80px at 80% -50%, #777777, #0f1111); }
        .realism-inner::before { content:""; width:100%; height:100%; left:0; top:0; border-radius:14px; background: radial-gradient(circle 60px at 0% 100%, #00e1ff1a, #0000ff11, transparent); position:absolute; }
        @media (min-width: 768px) { .realism-button { font-size:1rem; } .realism-inner{ padding:10px 16px; } }
        @media (min-width: 1024px) { .realism-button { font-size:0.95rem; } .realism-inner{ padding:8px 14px; } }
      `}</style>
      <button className="realism-button select-none touch-manipulation">
        <div className="realism-blob1" />
        <div className="realism-inner">{text}</div>
      </button>
    </div>
  );
};

export default RealismButton;


