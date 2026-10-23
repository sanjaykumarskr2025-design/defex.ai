import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Search, Trash2, Check } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { PartGraphic } from '../components/PartGraphic';

export const ReviewQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { inspections, deleteInspection } = useAppState();
  const [filter, setFilter] = useState<'ALL' | 'FAIL' | 'UNCERTAIN'>('ALL');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const failCount = inspections.filter((i) => i.status === 'FAIL').length;
  const uncertainCount = inspections.filter((i) => i.status === 'UNCERTAIN').length;

  const filteredItems = inspections.filter((item) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'FAIL' && item.status === 'FAIL') ||
      (filter === 'UNCERTAIN' && item.status === 'UNCERTAIN');

    const matchesSearch =
      item.partId.toLowerCase().includes(search.toLowerCase()) ||
      item.machine.toLowerCase().includes(search.toLowerCase()) ||
      item.partType.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteInspection(id);
    showToast('Inspection item removed');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Feedback */}
      {toast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter queue by part #, machine, or part type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

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
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 stroke-[1.5] mb-2" />
            <p className="text-xs font-semibold">No items match the current review filter</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isPass = item.status === 'PASS';
            const isFail = item.status === 'FAIL';

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/inspection?id=${item.id}&result=true`)}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-blue-200 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 flex items-center justify-center">
                    {item.imageSrc ? (
                      <img src={item.imageSrc} alt="Inspection" className="w-full h-full object-cover" />
                    ) : (
                      <PartGraphic className="w-full h-full" showBoundingBoxes={isFail} />
                    )}
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
                      {item.partType} • {item.machine}
                    </span>

                    <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                      {item.timestamp} • {item.duration} • Confidence: {item.confidence}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
