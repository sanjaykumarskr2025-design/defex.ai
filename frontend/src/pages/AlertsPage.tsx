import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Check, Trash2, BellRing, CheckCheck, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, clearAcknowledgedAlerts } = useAppState();
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const acknowledgedCount = alerts.filter((a) => a.acknowledged).length;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'CRITICAL') return a.severity === 'critical';
    if (filter === 'WARNING') return a.severity === 'warning';
    return true;
  });

  const handleSimulateAlert = () => {
    const severities: ('critical' | 'warning' | 'info')[] = ['critical', 'warning'];
    const titles = ['Spindle Overheat #03', 'Defect Tolerance Breach', 'Vibration Threshold Exceeded', 'Optical Sensor Drift'];
    const machines = ['CNC Machine 01', 'Press Machine 02', 'Assembly Line 03', 'Laser Cutter 05'];

    const chosenTitle = titles[Math.floor(Math.random() * titles.length)];
    const chosenMachine = machines[Math.floor(Math.random() * machines.length)];
    const chosenSev = severities[Math.floor(Math.random() * severities.length)];

    const testAlert = {
      id: `alt-${Date.now()}`,
      title: chosenTitle,
      machine: chosenMachine,
      timestamp: 'Just now',
      severity: chosenSev,
      description: `Automated test notification triggered from plant floor operations.`,
    };

    // Save to localStorage directly or use context
    const current = JSON.parse(localStorage.getItem('defex_alerts') || '[]');
    const next = [testAlert, ...current];
    localStorage.setItem('defex_alerts', JSON.stringify(next));
    window.location.reload();
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

      {/* Action Bar: Clear Acknowledged & Simulate */}
      <div className="flex items-center justify-between gap-2">
        {acknowledgedCount > 0 ? (
          <button
            onClick={() => {
              clearAcknowledgedAlerts();
              showToast('Cleared all acknowledged alerts');
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clear Acknowledged ({acknowledgedCount})</span>
          </button>
        ) : (
          <span className="text-xs font-semibold text-slate-400">Tap an alert to acknowledge</span>
        )}

        <button
          onClick={handleSimulateAlert}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ml-auto"
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>Simulate Alert</span>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 stroke-[1.5] mb-2" />
            <p className="text-xs font-semibold">No active alerts in this category</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl p-3.5 border transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between ${
                  alert.acknowledged
                    ? 'border-slate-100 opacity-60'
                    : isCritical
                    ? 'border-red-100 hover:border-red-300'
                    : 'border-slate-100 hover:border-amber-200'
                }`}
              >
                <div
                  onClick={() => {
                    acknowledgeAlert(alert.id);
                    showToast('Alert acknowledged');
                  }}
                  className="flex items-start gap-3 flex-1 cursor-pointer"
                >
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

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
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

                  <div className="flex items-center gap-1.5 mt-1">
                    {alert.acknowledged ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" /> Ack
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          acknowledgeAlert(alert.id);
                          showToast('Alert acknowledged');
                        }}
                        className="text-[10px] font-semibold text-blue-600 hover:underline"
                      >
                        Acknowledge
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAlert(alert.id);
                        showToast('Alert resolved');
                      }}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      title="Dismiss & Resolve"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
