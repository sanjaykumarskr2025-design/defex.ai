import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppContext';
import { PartGraphic } from '../components/PartGraphic';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { machines, inspections, viewMode, setViewMode } = useAppState();

  const passedCount = inspections.filter((i) => i.status === 'PASS').length;
  const failedCount = inspections.filter((i) => i.status === 'FAIL').length;
  const uncertainCount = inspections.filter((i) => i.status === 'UNCERTAIN').length;
  const totalCount = inspections.length;

  return (
    <div className="space-y-5 pb-20">
      {/* Top Prominent Layout Switcher Pill */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 pl-1">
          <span className="text-xs font-bold text-slate-800">Display Layout:</span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Choose between full desktop dashboard & mobile phone frame
          </span>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setViewMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'responsive'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Mockup</span>
          </button>
        </div>
      </div>

      {/* Greeting Header */}
      <div className="pt-1">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          Good Morning, {user?.name?.split(' ')[0] || 'Sanjay'}
        </h2>
        <p className="text-xs md:text-sm font-medium text-slate-500 mt-0.5">
          Here's what's happening with your inspection system.
        </p>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-4 gap-2.5 md:gap-3.5">
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-2.5 md:p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Layers className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] md:text-xs font-semibold text-slate-500 line-clamp-1">Total</span>
            <div className="text-lg md:text-2xl font-black text-slate-900 leading-tight">
              {totalCount * 42}
            </div>
            <div className="flex items-center text-[9px] md:text-[11px] font-bold text-blue-600 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
              <span>+5.2%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Passed */}
        <div className="bg-white rounded-2xl p-2.5 md:p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] md:text-xs font-semibold text-slate-500 line-clamp-1">Passed</span>
            <div className="text-lg md:text-2xl font-black text-slate-900 leading-tight">
              206
            </div>
            <div className="flex items-center text-[9px] md:text-[11px] font-bold text-emerald-600 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
              <span>+83.1%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Failed */}
        <div className="bg-white rounded-2xl p-2.5 md:p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-1.5">
            <XCircle className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] md:text-xs font-semibold text-slate-500 line-clamp-1">Failed</span>
            <div className="text-lg md:text-2xl font-black text-slate-900 leading-tight">
              32
            </div>
            <div className="flex items-center text-[9px] md:text-[11px] font-bold text-red-600 mt-0.5">
              <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
              <span>-12.9%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Uncertain */}
        <div className="bg-white rounded-2xl p-2.5 md:p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] md:text-xs font-semibold text-slate-500 line-clamp-1">Uncertain</span>
            <div className="text-lg md:text-2xl font-black text-slate-900 leading-tight">
              10
            </div>
            <div className="flex items-center text-[9px] md:text-[11px] font-bold text-amber-600 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
              <span>+4.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Section: Side by Side on Full View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Machine Status Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">Machine Status</h3>
            <button
              onClick={() => navigate('/machines')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {machines.slice(0, 3).map((m) => {
              const isRunning = m.status === 'running';
              const isStopped = m.status === 'stopped';

              return (
                <div
                  key={m.id}
                  onClick={() => navigate('/machines')}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-blue-100 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                      <Cpu className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                      <span className="text-[11px] font-medium text-slate-400">
                        Last: {m.lastActive}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isRunning ? 'bg-emerald-500 animate-pulse' : isStopped ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold capitalize ${
                          isRunning ? 'text-emerald-600' : isStopped ? 'text-red-600' : 'text-amber-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {isRunning ? '18 min ago' : isStopped ? '12 min ago' : '4 min ago'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Inspections Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">Recent Inspections</h3>
            <button
              onClick={() => navigate('/queue')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {inspections.slice(0, 3).map((item) => {
              const isPass = item.status === 'PASS';
              const isFail = item.status === 'FAIL';

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/inspection?id=${item.id}&result=true`)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-blue-100 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                      <PartGraphic className="w-full h-full" showBoundingBoxes={isFail} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900 text-sm">{item.partId}</h4>
                      <span className="text-xs font-medium text-slate-400 block">
                        {item.machine}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                        isPass
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : isFail
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
