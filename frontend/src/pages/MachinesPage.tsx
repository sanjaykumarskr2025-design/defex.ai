import React, { useState } from 'react';
import { Plus, Cpu, Power, X, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const MachinesPage: React.FC = () => {
  const { machines, toggleMachineStatus, addMachine, deleteMachine } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [newMachineType, setNewMachineType] = useState('CNC');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'running' | 'stopped' | 'maintenance'>('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachineName.trim()) return;
    addMachine(newMachineName, newMachineType);
    showToast(`Machine '${newMachineName}' added successfully`);
    setNewMachineName('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMachine(id);
      showToast(`Machine '${name}' removed`);
    }
  };

  const filteredMachines = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Alert */}
      {toast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search machines by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['ALL', 'running', 'stopped', 'maintenance'] as const).map((filter) => {
            const count = filter === 'ALL' ? machines.length : machines.filter((m) => m.status === filter).length;
            const isSelected = statusFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Machines List */}
      <div className="space-y-2.5">
        {filteredMachines.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400">
            <Cpu className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5] mb-2" />
            <p className="text-xs font-semibold">No machines match the selected filter</p>
          </div>
        ) : (
          filteredMachines.map((m) => {
            const isRunning = m.status === 'running';
            const isStopped = m.status === 'stopped';

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all group"
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
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => {
                      toggleMachineStatus(m.id);
                      showToast(`Status toggled for ${m.name}`);
                    }}
                    className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                      isRunning
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                    }`}
                    title="Click to toggle status"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isRunning ? 'Stop' : 'Start'}</span>
                  </button>

                  {/* Delete Machine Button */}
                  <button
                    onClick={(e) => handleDelete(m.id, m.name, e)}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Machine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Machine Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs md:text-sm shadow-md shadow-blue-500/20"
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
