import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, Sparkles } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { inspections, machines } = useAppState();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('30days');

  // Dynamic calculations
  const total = inspections.length;
  const passed = inspections.filter((i) => i.status === 'PASS').length;
  const failed = inspections.filter((i) => i.status === 'FAIL').length;
  const uncertain = inspections.filter((i) => i.status === 'UNCERTAIN').length;

  const yieldRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '94.8';
  const failRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '5.2';

  // Calculate defect distribution from inspections
  const defectCounts: Record<string, number> = {};
  inspections.forEach((ins) => {
    (ins.defects || []).forEach((def) => {
      const type = def.split(' ')[0] || 'Defect';
      defectCounts[type] = (defectCounts[type] || 0) + 1;
    });
  });

  const defectList = Object.entries(defectCounts).length > 0
    ? Object.entries(defectCounts).map(([type, count]) => ({
        type,
        count,
        percent: Math.round((count / Math.max(1, failed + uncertain)) * 100),
      }))
    : [
        { type: 'Surface Scratch', count: 18, percent: 52 },
        { type: 'Micro Crack', count: 10, percent: 28 },
        { type: 'Edge Burr', count: 5, percent: 14 },
        { type: 'Pitting', count: 2, percent: 6 },
      ];

  const exportCSV = () => {
    const headers = ['Inspection ID', 'Part ID', 'Part Type', 'Machine', 'Timestamp', 'Duration', 'Status', 'Confidence %', 'Defects', 'Dimensions'];
    const rows = inspections.map((i) => [
      i.id,
      i.partId,
      i.partType,
      i.machine,
      i.timestamp,
      i.duration,
      i.status,
      `${i.confidence}%`,
      (i.defects || []).join('; ') || 'None',
      i.dimensions,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `defex_ai_quality_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Time Range Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900 text-lg">Quality Intelligence</h3>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-xs">
          {(['today', '7days', '30days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                timeRange === range ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stat Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">Plant Performance Summary</h4>
          <span className="text-xs font-semibold text-slate-400">{total} Inspections Logged</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-600 block">First Pass Yield</span>
            <span className="text-xl font-black text-blue-950 mt-0.5 block">{yieldRate}%</span>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">+2.1% from target</span>
          </div>

          <div className="bg-red-50/60 p-3 rounded-xl border border-red-100">
            <span className="text-[11px] font-semibold text-red-600 block">Defect Rate</span>
            <span className="text-xl font-black text-red-950 mt-0.5 block">{failRate}%</span>
            <span className="text-[10px] font-bold text-red-600 mt-0.5 block">{failed} rejected</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Avg Inspection</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">2.8 sec</span>
            <span className="text-[10px] font-bold text-blue-600 mt-0.5 block">0.4s faster</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Online Machines</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              {machines.filter((m) => m.status === 'running').length}/{machines.length}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">99.1% Uptime</span>
          </div>
        </div>
      </div>

      {/* Defect Distribution */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Defect Breakdown & Severity</h4>

        <div className="space-y-3">
          {defectList.map((item, idx) => {
            const colors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-slate-400'];
            const color = colors[idx % colors.length];

            return (
              <div key={item.type} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.type}</span>
                  <span className="text-slate-500">{item.percent}% ({item.count} detections)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, item.percent)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export & Print Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={exportCSV}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-xs"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export CSV Report</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-xs"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Run New Inspection Primary Button */}
      <button
        onClick={() => navigate('/inspection')}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl text-xs md:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Run Live Camera Inspection</span>
      </button>
    </div>
  );
};
