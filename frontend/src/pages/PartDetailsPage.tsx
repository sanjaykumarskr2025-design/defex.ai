import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Edit3, ShieldCheck, Layers, Ruler, Plus, X, Save, Sparkles } from 'lucide-react';
import { PartGraphic } from '../components/PartGraphic';
import { useAppState, PartProfile } from '../context/AppContext';

export const PartDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { partProfiles, updatePartProfile } = useAppState();

  const [activeProfileId, setActiveProfileId] = useState<string>(partProfiles[0]?.id || 'p-1');
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const currentProfile = partProfiles.find((p) => p.id === activeProfileId) || partProfiles[0] || {
    id: 'p-1',
    name: 'Gear Housing',
    partNumber: 'Part #A125',
    material: 'Aluminium 6061-T6',
    tolerance: '±0.05 mm',
    surfaceFinish: 'Ra 0.8 µm',
    inspectionPoints: 5,
    status: 'Active',
    defectTypes: ['Scratch', 'Crack', 'Hole', 'Deformation'],
  };

  // Edit form state
  const [editName, setEditName] = useState(currentProfile.name);
  const [editPartNumber, setEditPartNumber] = useState(currentProfile.partNumber);
  const [editMaterial, setEditMaterial] = useState(currentProfile.material);
  const [editTolerance, setEditTolerance] = useState(currentProfile.tolerance);
  const [editSurfaceFinish, setEditSurfaceFinish] = useState(currentProfile.surfaceFinish);
  const [editPoints, setEditPoints] = useState(currentProfile.inspectionPoints);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleOpenEdit = () => {
    setEditName(currentProfile.name);
    setEditPartNumber(currentProfile.partNumber);
    setEditMaterial(currentProfile.material);
    setEditTolerance(currentProfile.tolerance);
    setEditSurfaceFinish(currentProfile.surfaceFinish);
    setEditPoints(currentProfile.inspectionPoints);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PartProfile = {
      ...currentProfile,
      name: editName,
      partNumber: editPartNumber,
      material: editMaterial,
      tolerance: editTolerance,
      surfaceFinish: editSurfaceFinish,
      inspectionPoints: Number(editPoints),
    };
    updatePartProfile(updated);
    setIsEditing(false);
    showToast('Part specifications updated successfully');
  };

  const availableDefects = ['Scratch', 'Crack', 'Hole', 'Deformation', 'Corrosion', 'Burr', 'Pitting', 'Wear'];

  const toggleDefect = (defect: string) => {
    const existing = currentProfile.defectTypes || [];
    const nextDefects = existing.includes(defect)
      ? existing.filter((d) => d !== defect)
      : [...existing, defect];

    updatePartProfile({
      ...currentProfile,
      defectTypes: nextDefects,
    });
    showToast(`Updated defect criteria: ${defect}`);
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

      {/* Part Profile Switcher */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Active Profile:</label>
        <select
          value={activeProfileId}
          onChange={(e) => setActiveProfileId(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          {partProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.partNumber})
            </option>
          ))}
        </select>
        <button
          onClick={handleOpenEdit}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Specs</span>
        </button>
      </div>

      {/* 3D Part Render Card */}
      <div className="bg-slate-950 rounded-2xl p-6 shadow-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-3 left-3 bg-slate-800/80 backdrop-blur-xs text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
          CAD Model • Raytraced
        </div>
        <div className="w-56 h-56">
          <PartGraphic className="w-full h-full" showBoundingBoxes={false} />
        </div>
      </div>

      {/* Part Title and Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{currentProfile.name}</h2>
            <span className="text-xs font-semibold text-slate-400">{currentProfile.partNumber} Specifications</span>
          </div>

          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-black px-2.5 py-1 rounded-lg">
            {currentProfile.status}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Material</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentProfile.material}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Tolerance</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentProfile.tolerance}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Inspection Points</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentProfile.inspectionPoints} Regions</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Surface Finish</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentProfile.surfaceFinish}</span>
          </div>
        </div>
      </div>

      {/* Defect Types Chips */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Defect Types Checked</h4>
          <span className="text-[10px] text-slate-400 font-semibold">Click to toggle</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableDefects.map((defect) => {
            const isSelected = (currentProfile.defectTypes || []).includes(defect);

            return (
              <button
                key={defect}
                onClick={() => toggleDefect(defect)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{defect}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => navigate(`/inspection?part=${encodeURIComponent(currentProfile.name)}`)}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all text-xs md:text-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>Inspect This Part ({currentProfile.name})</span>
      </button>

      {/* Edit Specifications Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Edit Specifications</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Part Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Part Number</label>
                <input
                  type="text"
                  required
                  value={editPartNumber}
                  onChange={(e) => setEditPartNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Material</label>
                  <input
                    type="text"
                    value={editMaterial}
                    onChange={(e) => setEditMaterial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Tolerance</label>
                  <input
                    type="text"
                    value={editTolerance}
                    onChange={(e) => setEditTolerance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Surface Finish</label>
                  <input
                    type="text"
                    value={editSurfaceFinish}
                    onChange={(e) => setEditSurfaceFinish(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Insp. Points</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editPoints}
                    onChange={(e) => setEditPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
