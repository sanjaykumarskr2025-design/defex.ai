import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Check, Filter } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert } = useAppState();
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'CRITICAL') return a.severity === 'critical';
    if (filter === 'WARNING') return a.severity === 'warning';
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
          All ({alerts.length})
        </button>

        <button
          onClick={() => setFilter('CRITICAL')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
            filter === 'CRITICAL'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Critical ({criticalCount})
        </button>

        <button
          onClick={() => setFilter('WARNING')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
            filter === 'WARNING'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Warning ({warningCount})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-2.5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';

          return (
            <div
              key={alert.id}
              onClick={() => acknowledgeAlert(alert.id)}
              className={`bg-white rounded-2xl p-3.5 border transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between cursor-pointer ${
                alert.acknowledged
                  ? 'border-slate-100 opacity-60'
                  : isCritical
                  ? 'border-red-100 hover:border-red-300'
                  : 'border-slate-100 hover:border-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCritical
                      ? 'bg-red-50 text-red-600'
                      : isWarning
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {isCritical ? (
                    <AlertCircle className="w-5 h-5 stroke-[2.5]" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Info className="w-5 h-5 stroke-[2.5]" />
                  )}
                </div>

                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">
                    {alert.title}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                    {alert.machine}
                  </span>
                  <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-1">
                    {alert.description}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 block mt-1">
                    {alert.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                    isCritical
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : isWarning
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}
                >
                  {alert.severity}
                </span>

                {alert.acknowledged ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <Check className="w-3 h-3 stroke-[3]" /> Ack
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-blue-600 hover:underline">
                    Tap to Ack
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
