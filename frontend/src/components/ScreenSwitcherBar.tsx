import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Monitor, Smartphone } from 'lucide-react';
import { useAppState } from '../context/AppContext';

interface ScreenSwitcherBarProps {
  onToggleDrawer: () => void;
}

export const ScreenSwitcherBar: React.FC<ScreenSwitcherBarProps> = ({ onToggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { viewMode, setViewMode } = useAppState();

  const screens = [
    { num: '1', name: 'Dashboard', path: '/' },
    { num: '2', name: 'Inspection', path: '/inspection' },
    { num: '3', name: 'Result', path: '/inspection?result=true' },
    { num: '4', name: 'Review Queue', path: '/queue' },
    { num: '5', name: 'Machines', path: '/machines' },
    { num: '6', name: 'Part Details', path: '/part-details' },
    { num: '7', name: 'Alerts', path: '/alerts' },
    { num: '8', name: 'Settings', path: '/settings' },
    { num: '9', name: 'Login', path: '/login' },
    { num: '10', name: 'Mobile Menu', isAction: true },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-3 md:px-4 py-2 sticky top-0 z-50 shadow-xs">
      <div className="flex items-center justify-between max-w-6xl mx-auto gap-3 flex-wrap">
        {/* Full vs Mobile Mockup Toggle - Prominently Displayed */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-xs">
          <button
            onClick={() => setViewMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'responsive'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full</span>
          </button>

          <button
            onClick={() => setViewMode('mobile-mockup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mobile-mockup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Mockup</span>
          </button>
        </div>

        {/* Screen Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto min-w-max py-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Screens:
          </span>

          {screens.map((s) => {
            const isCurrent = s.path && location.pathname === s.path.split('?')[0];

            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.isAction) {
                    onToggleDrawer();
                  } else if (s.path) {
                    navigate(s.path);
                  }
                }}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className={`text-[10px] ${isCurrent ? 'text-blue-200' : 'text-slate-400'}`}>
                  {s.num}.
                </span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
