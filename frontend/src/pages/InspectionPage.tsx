import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Upload, ChevronRight, CheckCircle2, AlertTriangle, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { PartGraphic } from '../components/PartGraphic';
import { useAppState } from '../context/AppContext';

export const InspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addInspection } = useAppState();

  const [step, setStep] = useState<1 | 2 | 3>(() => {
    return searchParams.get('result') === 'true' ? 3 : 1;
  });

  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [partType, setPartType] = useState('Gear Housing');
  const [machine, setMachine] = useState('CNC Machine 01');
  const [profile, setProfile] = useState('Default Profile');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startAnalysis = () => {
    setStep(2);
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setStep(3);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleSaveRecord = () => {
    addInspection({
      id: `ins-${Date.now()}`,
      partId: `Part #${Math.floor(100 + Math.random() * 900)}`,
      partType,
      machine,
      timestamp: 'Just now',
      duration: '4.8 sec',
      status: 'FAIL',
      confidence: 92.3,
      defects: ['Scratch 0.92'],
      dimensions: 'Within Tolerance',
    });
    navigate('/queue');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 3-Step Indicator Header */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between">
        {[
          { num: 1, label: 'Capture' },
          { num: 2, label: 'Analyze' },
          { num: 3, label: 'Result' },
        ].map((s, index) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;

          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`h-0.5 w-8 rounded-full mb-4 ${
                    step > index + 1 ? 'bg-emerald-500' : 'bg-slate-100'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Viewport Content based on Step */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Camera Viewport with Live Reticle */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] bg-slate-950 flex flex-col justify-between p-3">
            {/* Top Bar inside Viewport */}
            <div className="flex items-center justify-between z-10">
              <div className="bg-slate-900/80 backdrop-blur-md text-cyan-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Live Camera</span>
              </div>

              <button className="p-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700/50">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Industrial Part Visual with Reticle Target */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <PartGraphic className="w-full h-full" showReticle={true} />
            </div>

            {/* Bottom info inside viewport */}
            <div className="z-10 text-center">
              <span className="text-[10px] font-medium text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                Align part inside blue brackets
              </span>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl font-bold text-xs">
            <button
              onClick={() => setMode('camera')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                mode === 'camera' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                mode === 'upload' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>

          {/* Part Details Selector Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Part Details</h4>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Part Type</label>
                <select
                  value={partType}
                  onChange={(e) => setPartType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option>Gear Housing</option>
                  <option>Turbine Flange</option>
                  <option>Bearing Collar</option>
                  <option>Valve Plate</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Machine</label>
                <select
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option>CNC Machine 01</option>
                  <option>Press Machine 02</option>
                  <option>Assembly Line 03</option>
                  <option>Packaging Line 04</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Inspection Profile</label>
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option>Default Profile (Precision Mode)</option>
                  <option>High Speed Production</option>
                  <option>Critical Surface Tolerance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={startAnalysis}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Start Inspection</span>
          </button>
        </div>
      )}

      {/* Step 2: Analyzing Animation */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs text-center space-y-6 py-12">
          <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
            <PartGraphic className="w-full h-full" isScanning={true} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Analyzing Surface Quality...</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Running deep neural defect classification models
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 3: Inspection Result (Screen 3) */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Inspected Graphic with AI Defect Overlays */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] bg-slate-950 flex items-center justify-center p-4">
            <PartGraphic className="w-full h-full" showBoundingBoxes={true} />
          </div>

          {/* Overall Result Banner */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                FAIL
              </span>
              <div className="text-left">
                <span className="text-[11px] font-bold text-red-500 block uppercase">Overall Result</span>
                <span className="text-sm font-black text-red-700">DEFECT DETECTED</span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-red-400" />
          </div>

          {/* Result Data Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
              <span className="font-semibold text-slate-400">Part Type</span>
              <span className="font-bold text-slate-800">{partType}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
              <span className="font-semibold text-slate-400">Confidence</span>
              <span className="font-black text-blue-600">92.3%</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
              <span className="font-semibold text-slate-400">Detected Defects</span>
              <span className="font-black text-red-600">1 (Scratch)</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
              <span className="font-semibold text-slate-400">Dimensions</span>
              <span className="font-bold text-emerald-600">Within Tolerance</span>
            </div>

            <div className="flex items-center justify-between py-1.5 text-xs">
              <span className="font-semibold text-slate-400">Inspection Time</span>
              <span className="font-bold text-slate-800">4.8 sec</span>
            </div>
          </div>

          {/* Actions Button Group */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/part-details')}
              className="w-full bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 font-bold py-3 px-4 rounded-xl shadow-xs text-xs md:text-sm transition-all"
            >
              View Details
            </button>

            <button
              onClick={handleSaveRecord}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-xs md:text-sm transition-all"
            >
              Save Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
