import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Edit3, ShieldCheck, Layers, Ruler } from 'lucide-react';
import { PartGraphic } from '../components/PartGraphic';

export const PartDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDefects, setSelectedDefects] = useState<string[]>(['Scratch']);

  const defectList = ['Scratch', 'Crack', 'Hole', 'Deformation', 'Corrosion', 'Burr'];

  const toggleDefect = (defect: string) => {
    setSelectedDefects((prev) =>
      prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 3D Part Render Card */}
      <div className="bg-slate-950 rounded-2xl p-6 shadow-xl border border-slate-800 flex items-center justify-center">
        <div className="w-56 h-56">
          <PartGraphic className="w-full h-full" showBoundingBoxes={false} />
        </div>
      </div>

      {/* Part Title and Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Gear Housing</h2>
            <span className="text-xs font-semibold text-slate-400">Part #A125 Specifications</span>
          </div>

          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-black px-2.5 py-1 rounded-lg">
            Active
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Material</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">Aluminium 6061</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Tolerance</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">±0.05 mm</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Inspection Points</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">5 Regions</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
            <span className="text-[11px] font-semibold text-slate-400 block">Surface Finish</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">Ra 0.8 µm</span>
          </div>
        </div>
      </div>

      {/* Defect Types Chips */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Defect Types Checked</h4>

        <div className="flex flex-wrap gap-2">
          {defectList.map((defect) => {
            const isSelected = selectedDefects.includes(defect);

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
        onClick={() => navigate('/inspection')}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all text-xs md:text-sm"
      >
        <Edit3 className="w-4 h-4" />
        <span>Inspect This Part</span>
      </button>
    </div>
  );
};
