import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ChevronRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { PartGraphic } from '../components/PartGraphic';

export const ReviewQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { inspections } = useAppState();
  const [filter, setFilter] = useState<'ALL' | 'FAIL' | 'UNCERTAIN'>('ALL');

  const failCount = inspections.filter((i) => i.status === 'FAIL').length;
  const uncertainCount = inspections.filter((i) => i.status === 'UNCERTAIN').length;

  const filteredItems = inspections.filter((item) => {
    if (filter === 'FAIL') return item.status === 'FAIL';
    if (filter === 'UNCERTAIN') return item.status === 'UNCERTAIN';
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Filter Tabs Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          All ({inspections.length})
        </button>

        <button
          onClick={() => setFilter('FAIL')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
            filter === 'FAIL'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Fail ({failCount})
        </button>

        <button
          onClick={() => setFilter('UNCERTAIN')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
            filter === 'UNCERTAIN'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Uncertain ({uncertainCount})
        </button>
      </div>

      {/* Queue Items List */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isPass = item.status === 'PASS';
          const isFail = item.status === 'FAIL';

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/inspection?id=${item.id}&result=true`)}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-blue-200 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                  <PartGraphic className="w-full h-full" showBoundingBoxes={isFail} />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm leading-none">{item.partId}</h4>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isPass
                          ? 'bg-emerald-50 text-emerald-600'
                          : isFail
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-slate-500 block mt-1">
                    {item.machine}
                  </span>

                  <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                    {item.timestamp} • {item.duration}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
