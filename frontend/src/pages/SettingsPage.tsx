import React, { useState } from 'react';
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
  X,
  Check,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    rules,
    updateRules,
    notifications,
    updateNotifications,
    exportDatabaseJSON,
    resetToFactoryDefaults,
    partProfiles,
    machines,
    inspections,
  } = useAppState();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // User management local state
  const [userList, setUserList] = useState([
    { id: 'u1', name: user?.name || 'Sanjay Kumar', email: user?.email || 'sanjay@defex.ai', role: user?.role || 'Operator' },
    { id: 'u2', name: 'Alex Rivera', email: 'alex@defex.ai', role: 'Quality Lead' },
    { id: 'u3', name: 'David Chen', email: 'david@defex.ai', role: 'Machine Technician' },
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Operator');

  // Machine config local state
  const [visionFps, setVisionFps] = useState('30');
  const [rtspUrl, setRtspUrl] = useState('rtsp://192.168.1.100:554/h264');
  const [calibOffset, setCalibOffset] = useState('0.02');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    setUserList((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, name: newUserName, email: newUserEmail, role: newUserRole },
    ]);
    setNewUserName('');
    setNewUserEmail('');
    triggerToast('New operator added successfully');
  };

  const handleRemoveUser = (id: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== id));
    triggerToast('User removed');
  };

  const handleSaveMachineConfig = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Vision & network calibration saved');
    setActiveModal(null);
  };

  const menuSections = [
    { id: 'users', label: 'User Management', icon: Users, desc: 'Manage access roles and operators' },
    { id: 'machines_cfg', label: 'Machine Configuration', icon: Cpu, desc: 'Network calibration & vision parameters' },
    { id: 'parts', label: 'Part Profiles', icon: Layers, desc: 'CAD reference & inspection tolerances', path: '/part-details' },
    { id: 'rules', label: 'Inspection Rules', icon: Sliders, desc: 'Defect thresholds & confidence scoring' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'SMS, webhook and email alert channels' },
    { id: 'storage', label: 'Storage & Backup', icon: HardDrive, desc: 'Database export, cache & factory reset' },
    { id: 'about', label: 'About', icon: Info, desc: 'DefEx.ai v1.0.0 • Production Build' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Feedback */}
      {successToast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{successToast}</span>
        </div>
      )}

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

        <button
          onClick={() => setActiveModal('users')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg"
        >
          Manage
        </button>
      </div>

      {/* Settings Menu List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-50 overflow-hidden">
        {menuSections.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  setActiveModal(item.id);
                }
              }}
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

      {/* MODAL 1: USER MANAGEMENT */}
      {activeModal === 'users' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">User & Role Management</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operator List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Operators</label>
              {userList.map((u) => (
                <div key={u.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{u.name}</h5>
                    <span className="text-[10px] font-medium text-slate-400">{u.email} • {u.role}</span>
                  </div>
                  {userList.length > 1 && (
                    <button
                      onClick={() => handleRemoveUser(u.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add User Form */}
            <form onSubmit={handleAddUser} className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Add New Team Member</label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option>Operator</option>
                <option>Quality Inspector</option>
                <option>Admin / Plant Manager</option>
                <option>Maintenance Engineer</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Team Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MACHINE CONFIGURATION */}
      {activeModal === 'machines_cfg' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Machine & Vision Calibration</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMachineConfig} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">RTSP Stream Address</label>
                <input
                  type="text"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Frame Rate (FPS)</label>
                  <select
                    value={visionFps}
                    onChange={(e) => setVisionFps(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="15">15 FPS (Eco)</option>
                    <option value="30">30 FPS (Standard)</option>
                    <option value="60">60 FPS (High Speed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Calibration Offset (mm)</label>
                  <input
                    type="text"
                    value={calibOffset}
                    onChange={(e) => setCalibOffset(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-700">
                Linked to {machines.length} active factory stations.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/machines')}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                >
                  Manage Machines
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INSPECTION RULES */}
      {activeModal === 'rules' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Inspection Rules & AI Scorer</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Minimum Confidence Score</label>
                  <span className="text-xs font-black text-blue-600">{rules.minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={rules.minConfidence}
                  onChange={(e) => updateRules({ minConfidence: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Detections below {rules.minConfidence}% will be classified as 'UNCERTAIN' for human review.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Strictness Profile</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Strict', 'Normal', 'High-Speed'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateRules({ strictness: mode })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        rules.strictness === mode
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">Auto-save Defect Frames</span>
                  <input
                    type="checkbox"
                    checked={rules.autoSaveFailures}
                    onChange={(e) => updateRules({ autoSaveFailures: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">Instant Alert on Quality Breach</span>
                  <input
                    type="checkbox"
                    checked={rules.alertOnDefect}
                    onChange={(e) => updateRules({ alertOnDefect: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                </label>
              </div>

              <button
                onClick={() => {
                  triggerToast('Inspection rules updated');
                  setActiveModal(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NOTIFICATIONS */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Alert & Notification Channels</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Email Notifications</h5>
                  <span className="text-[10px] text-slate-400">Send critical defect reports to plant lead</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => updateNotifications({ emailAlerts: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">SMS / WhatsApp Pager</h5>
                  <span className="text-[10px] text-slate-400">Emergency alerts on line halts</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={(e) => updateNotifications({ smsAlerts: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Webhook Integrations</h5>
                  <span className="text-[10px] text-slate-400">Dispatch events to MES, ERP, or Slack</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.webhookAlerts}
                  onChange={(e) => updateNotifications({ webhookAlerts: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Critical Only Filter</h5>
                  <span className="text-[10px] text-slate-400">Suppress low-priority warnings</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.criticalOnly}
                  onChange={(e) => updateNotifications({ criticalOnly: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
              </label>

              <button
                onClick={() => {
                  triggerToast('Notification preferences saved');
                  setActiveModal(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all"
              >
                Save Channels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: STORAGE & BACKUP */}
      {activeModal === 'storage' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Storage & Data Management</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Logged Inspections</span>
                  <span className="font-bold text-slate-900">{inspections.length} records</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Part Profiles</span>
                  <span className="font-bold text-slate-900">{partProfiles.length} CAD profiles</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Connected Machines</span>
                  <span className="font-bold text-slate-900">{machines.length} units</span>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={() => {
                  exportDatabaseJSON();
                  triggerToast('System backup JSON downloaded');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Database Backup (JSON)</span>
              </button>

              {/* Factory Reset Button */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to restore factory default settings? All local cache will be refreshed.')) {
                    resetToFactoryDefaults();
                    triggerToast('Factory defaults restored');
                    setActiveModal(null);
                  }
                }}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all border border-red-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: ABOUT */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">About DefEx.ai</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold">Platform</span>
                <span>DefEx.ai Industrial Vision</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold">Version</span>
                <span className="font-bold text-blue-600">v1.0.0 Production</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold">Vision Inference Engine</span>
                <span>YOLOv8-Nano Defect Vision</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold">Camera Protocol</span>
                <span>WebRTC MediaStreams / 1080p</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold">Latency</span>
                <span>~42ms Edge Inference</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-bold">Architecture</span>
                <span>SPA / GitHub Pages Static Mirror</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
