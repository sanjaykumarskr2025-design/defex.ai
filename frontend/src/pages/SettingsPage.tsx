import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Cpu,
  Layers,
  Sliders,
  Bell,
  HardDrive,
  Info,
  ChevronRight,
  LogOut,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { viewMode, setViewMode } = useAppState();

  const menuSections = [
    { label: 'User Management', icon: Users, desc: 'Manage access roles and operators' },
    { label: 'Machine Configuration', icon: Cpu, desc: 'Network calibration & vision parameters', path: '/machines' },
    { label: 'Part Profiles', icon: Layers, desc: 'CAD reference & inspection tolerances', path: '/part-details' },
    { label: 'Inspection Rules', icon: Sliders, desc: 'Defect thresholds & confidence scoring' },
    { label: 'Notifications', icon: Bell, desc: 'SMS, webhook and email alert channels', path: '/alerts' },
    { label: 'Storage & Backup', icon: HardDrive, desc: 'Local cache, uploads and cloud retention' },
    { label: 'About', icon: Info, desc: 'DefEx.ai v1.0.0 • Production Build' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* User Profile Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            {user?.name?.charAt(0) || 'S'}
          </div>

          <div className="text-left">
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {user?.name || 'Sanjay Kumar'}
            </h3>
            <span className="text-xs font-semibold text-slate-400 capitalize">
              {user?.role || 'Operator'} • {user?.email || 'sanjay@defex.ai'}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>

      {/* Desktop/Mobile Frame View Switcher (Handy on Settings) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Preview Layout Mode</h4>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setViewMode('responsive')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'responsive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Responsive View</span>
          </button>

          <button
            onClick={() => setViewMode('mobile-mockup')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'mobile-mockup'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Phone Mockup</span>
          </button>
        </div>
      </div>

      {/* Settings Menu List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-50 overflow-hidden">
        {menuSections.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>

                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm">{item.label}</h4>
                  <span className="text-[10px] md:text-[11px] font-medium text-slate-400 block">
                    {item.desc}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout Session</span>
      </button>
    </div>
  );
};
