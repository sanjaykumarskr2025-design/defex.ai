import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { inspections, machines } = useAppState();

  return (
    <div className="space-y-4 pb-20">
      {/* Overview Stat Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Quality Performance</h3>
          <span className="text-xs font-semibold text-slate-400">Past 30 Days</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-600 block">First Pass Yield</span>
            <span className="text-xl font-black text-blue-950 mt-0.5 block">94.8%</span>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">+2.1% from target</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Avg Inspection Time</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">3.2 sec</span>
            <span className="text-[10px] font-bold text-blue-600 mt-0.5 block">0.4s faster</span>
          </div>
        </div>
      </div>

      {/* Defect Distribution */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Defect Breakdown</h4>

        <div className="space-y-2.5">
          {[
            { type: 'Surface Scratches', percent: 48, count: 24, color: 'bg-red-500' },
            { type: 'Micro Cracks', percent: 26, count: 13, color: 'bg-amber-500' },
            { type: 'Edge Deformation', percent: 16, count: 8, color: 'bg-blue-500' },
            { type: 'Bore Pitting', percent: 10, count: 5, color: 'bg-slate-400' },
          ].map((item) => (
            <div key={item.type} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{item.type}</span>
                <span className="text-slate-500">{item.percent}% ({item.count})</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <button
        onClick={() => navigate('/inspection')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs md:text-sm shadow-md shadow-blue-500/20"
      >
        Run New Inspection
      </button>
    </div>
  );
};
