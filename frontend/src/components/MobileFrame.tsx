import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="py-6 flex justify-center items-center min-h-[90vh]">
      {/* Outer Phone Shell */}
      <div className="w-[390px] h-[844px] bg-slate-900 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-800 relative flex flex-col">
        {/* Physical Button Accents */}
        <div className="absolute -left-1.5 top-24 w-1 h-8 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-1.5 top-36 w-1 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-1.5 top-52 w-1 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-r-md" />

        {/* Screen Bezel */}
        <div className="w-full h-full bg-slate-50 rounded-[40px] overflow-hidden flex flex-col relative">
          {/* iOS Status Bar */}
          <div className="h-10 px-6 pt-2 flex items-center justify-between text-slate-800 text-xs font-bold select-none z-50 bg-white/70 backdrop-blur-md">
            <span>9:41</span>

            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />

            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Internal Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-5 bg-white flex items-center justify-center pointer-events-none select-none z-50">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
