import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Eye, ListChecks, Cpu, BarChart2, Bell, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppContext';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { alerts } = useAppState();

  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  if (!isOpen) return null;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Inspection', path: '/inspection', icon: Eye },
    { label: 'Review Queue', path: '/queue', icon: ListChecks },
    { label: 'Machines', path: '/machines', icon: Cpu },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
    { label: 'Alerts', path: '/alerts', icon: Bell, badge: unreadAlertsCount },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer content */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  {user?.name || 'Sanjay Kumar'}
                </h3>
                <span className="text-xs font-medium text-slate-500 capitalize">
                  {user?.role || 'Operator'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 space-y-3 bg-slate-50/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PartSight AI v1.0.0</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
