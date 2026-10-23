import React, { useState } from 'react';
import { Plus, Cpu, ChevronRight, Activity, Power, X } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const MachinesPage: React.FC = () => {
  const { machines, toggleMachineStatus, addMachine } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [newMachineType, setNewMachineType] = useState('CNC');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachineName.trim()) return;
    addMachine(newMachineName, newMachineType);
    setNewMachineName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Machines List */}
      <div className="space-y-3">
        {machines.map((m) => {
          const isRunning = m.status === 'running';
          const isStopped = m.status === 'stopped';

          return (
            <div
              key={m.id}
              onClick={() => toggleMachineStatus(m.id)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-blue-200 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                  <Cpu className="w-5 h-5 stroke-[1.8]" />
                </div>

                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>

                  <div className="flex items-center gap-2 mt-1">
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

                    <span className="text-slate-300">•</span>

                    <span className="text-[11px] font-medium text-slate-400">
                      Uptime: {m.uptime}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                    Last: {m.lastActive} • {m.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
                  Click to toggle
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating or bottom Add Machine Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add New Machine</span>
      </button>

      {/* Add Machine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Machine</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Machine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Cutter 05"
                  value={newMachineName}
                  onChange={(e) => setNewMachineName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Type</label>
                <select
                  value={newMachineType}
                  onChange={(e) => setNewMachineType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option>CNC</option>
                  <option>Press</option>
                  <option>Assembly</option>
                  <option>Packaging</option>
                  <option>Laser</option>
                  <option>Robotic Arm</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
