import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Smartphone, Monitor } from 'lucide-react';
import { Logo } from './Logo';
import { useAppState } from '../context/AppContext';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  rightAction?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ title, showBack = false, backTo = '/', rightAction }) => {
  const navigate = useNavigate();
  const { alerts, viewMode, setViewMode } = useAppState();

  const unreadCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={() => navigate(backTo)}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : null}

          {title ? (
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
          ) : (
            <Logo size="sm" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg mr-1 text-xs font-semibold text-slate-600 border border-slate-200/50">
            <button
              onClick={() => setViewMode('responsive')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                viewMode === 'responsive' ? 'bg-white shadow-xs text-blue-600' : 'hover:text-slate-900'
              }`}
              title="Full responsive view"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full</span>
            </button>
            <button
              onClick={() => setViewMode('mobile-mockup')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                viewMode === 'mobile-mockup' ? 'bg-white shadow-xs text-blue-600' : 'hover:text-slate-900'
              }`}
              title="Mobile device frame view (as in mockup)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile Mockup</span>
            </button>
          </div>

          {rightAction ? (
            rightAction
          ) : (
            <button
              onClick={() => navigate('/alerts')}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
