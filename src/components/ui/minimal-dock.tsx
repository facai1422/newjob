'use client'

import React, { useState } from 'react';
import { Home, Search, Mail, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface DockItemProps {
  item: DockItem;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const DockItemComponent: React.FC<DockItemProps> = ({ item, isHovered, onHover }) => {
  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        className={[
          'relative flex items-center justify-center',
          'w-11 h-11 rounded-lg',
          'bg-white/5 backdrop-blur-[2px]',
          'border border-white/10',
          'transition-all duration-300 ease-out',
          'cursor-pointer',
          isHovered
            ? 'scale-110 bg-white/10 border-white/20 -translate-y-1 shadow-lg shadow-white/10'
            : 'hover:scale-105 hover:bg-white/7 hover:-translate-y-0.5'
        ].join(' ')}
        onClick={item.onClick}
        style={{
          boxShadow: isHovered ? '0 4px 24px 0 rgba(255,255,255,0.08)' : undefined,
          transitionProperty: 'box-shadow, transform, background, border-color'
        }}
        aria-label={item.label}
      >
        <div className={[
          'text-white transition-all duration-300',
          isHovered ? 'scale-105 drop-shadow-[0_1px_4px_rgba(255,255,255,0.10)]' : ''
        ].join(' ')}>
          {item.icon}
        </div>
      </button>

      {/* Tooltip */}
      <div
        className={[
          'absolute -top-10 left-1/2 transform -translate-x-1/2',
          'px-2.5 py-1 rounded-md',
          'bg-black/70 backdrop-blur',
          'text-white text-xs font-normal',
          'border border-white/5',
          'transition-all duration-200',
          'pointer-events-none whitespace-nowrap shadow-sm',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        ].join(' ')}
        role="tooltip"
      >
        {item.label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-black/70 rotate-45 border-r border-b border-white/5" />
        </div>
      </div>
    </div>
  );
};

const MinimalistDock: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const dockItems: DockItem[] = [
    { id: 'home', icon: <Home size={20} />, label: 'Home', onClick: () => navigate('/') },
    { id: 'search', icon: <Search size={20} />, label: 'Locations', onClick: () => navigate('/locations') },
    { id: 'mail', icon: <Mail size={20} />, label: 'Stories', onClick: () => navigate('/testimonials') },
    { id: 'profile', icon: <User size={20} />, label: 'Profile', onClick: () => navigate('/my-resume') },
    // { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="fixed inset-x-0 bottom-6 z-[80] flex items-center justify-center pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* Dock Container */}
        <div
          className={[
            'flex items-end gap-3 px-6 py-4',
            'rounded-2xl',
            'bg-black/40 backdrop-blur-xl',
            'border border-white/10',
            'shadow-2xl',
            'transition-all duration-500 ease-out',
            hoveredItem ? 'scale-105' : ''
          ].join(' ')}
        >
          {dockItems.map((item) => (
            <DockItemComponent
              key={item.id}
              item={item}
              isHovered={hoveredItem === item.id}
              onHover={setHoveredItem}
            />
          ))}
        </div>

        {/* Reflection Effect */}
        <div className="absolute top-full left-0 right-0 h-12 overflow-hidden">
          <div
            className={[
              'flex items-start gap-3 px-6 py-4',
              'rounded-2xl',
              'bg-black/20 backdrop-blur-xl',
              'border border-white/5',
              'opacity-30',
              'transform scale-y-[-1]',
              'transition-all duration-500 ease-out',
              hoveredItem ? 'scale-105 scale-y-[-1.05]' : ''
            ].join(' ')}
          >
            {dockItems.map((item) => (
              <div
                key={`reflection-${item.id}`}
                className={[
                  'flex items-center justify-center',
                  'w-12 h-12 rounded-xl',
                  'bg-white/5',
                  'transition-all duration-300 ease-out',
                  hoveredItem === item.id ? 'scale-125 -translate-y-2' : ''
                ].join(' ')}
              >
                <div className="text-white/50">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalistDock;


