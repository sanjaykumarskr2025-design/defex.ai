import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Eye, ListChecks, BarChart2, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMore }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Inspection', path: '/inspection', icon: Eye },
    { label: 'Queue', path: '/queue', icon: ListChecks },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] max-w-md mx-auto md:max-w-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Button to trigger drawer */}
        <button
          onClick={onOpenMore}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <div className="p-1 rounded-full">
            <MoreHorizontal className="w-5 h-5 stroke-2" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">More</span>
        </button>
      </div>
    </div>
  );
};
