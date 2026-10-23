import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const textColor = variant === 'white' ? 'text-white' : variant === 'light' ? 'text-blue-900' : 'text-slate-900';
  const subColor = variant === 'white' ? 'text-blue-100' : 'text-blue-600 font-medium tracking-wide';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Stylized Eye Outlines */}
          <path
            d="M5 35C15 15 35 5 50 5C65 5 85 15 95 35C85 55 65 65 50 65C35 65 15 55 5 35Z"
            stroke="#1E40AF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Inner Iris Ring */}
          <circle cx="50" cy="35" r="18" stroke="#2563EB" strokeWidth="5" fill="#EFF6FF" />
          {/* Quality Pupil Dot */}
          <circle cx="50" cy="35" r="8" fill="#1E40AF" />
          {/* Optical Target Reticle Marks */}
          <line x1="50" y1="12" x2="50" y2="18" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="52" x2="50" y2="58" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <line x1="27" y1="35" x2="33" y2="35" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <line x1="67" y1="35" x2="73" y2="35" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col text-left leading-none">
        <span className={`${titleSizes[size]} ${textColor} tracking-tight font-sans`}>
          PartSight <span className="text-blue-600">AI</span>
        </span>
        {showSubtitle && (
          <span className={`${subSizes[size]} ${subColor} uppercase font-sans mt-0.5`}>
            Industrial Quality Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
