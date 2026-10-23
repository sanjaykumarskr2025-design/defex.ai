import React from 'react';

interface PartGraphicProps {
  showBoundingBoxes?: boolean;
  showReticle?: boolean;
  isScanning?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  imageSrc?: string | null;
}

export const PartGraphic: React.FC<PartGraphicProps> = ({
  showBoundingBoxes = false,
  showReticle = false,
  isScanning = false,
  className = '',
  imageSrc = null,
}) => {
  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl select-none ${className}`}>
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Main Visual Display: Real Camera Snapshot OR Industrial Part SVG */}
      <div className="relative w-4/5 aspect-square max-w-[280px] flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Inspected Real Part"
            className="w-full h-full object-cover rounded-xl border border-slate-700 shadow-2xl"
          />
        ) : (
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
            <defs>
              {/* Metallic Radial Gradients */}
              <radialGradient id="metalOuter" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="35%" stopColor="#CBD5E1" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>

              <radialGradient id="metalInner" cx="40%" cy="38%" r="60%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="45%" stopColor="#CBD5E1" />
                <stop offset="85%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>

              <radialGradient id="boreShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="75%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>

              <linearGradient id="scratchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
              </linearGradient>

              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Outer Housing Rim */}
            <circle cx="150" cy="150" r="130" fill="url(#metalOuter)" stroke="#64748B" strokeWidth="3" filter="url(#shadow)" />
            {/* Beveled Chamfer Step */}
            <circle cx="150" cy="150" r="118" fill="none" stroke="#F1F5F9" strokeWidth="2.5" opacity="0.8" />
            <circle cx="150" cy="150" r="114" fill="url(#metalInner)" stroke="#475569" strokeWidth="2" />

            {/* Precision Machined Mounting Holes & Bosses (6 Holes) */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 150 + 92 * Math.cos(rad);
              const y = 150 + 92 * Math.sin(rad);
              return (
                <g key={i}>
                  {/* Hole Bevel */}
                  <circle cx={x} cy={y} r="15" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
                  <circle cx={x} cy={y} r="13" fill="#F8FAFC" opacity="0.7" />
                  {/* Bore */}
                  <circle cx={x} cy={y} r="9" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                </g>
              );
            })}

            {/* Inner Step Ring */}
            <circle cx="150" cy="150" r="68" fill="url(#metalOuter)" stroke="#334155" strokeWidth="2.5" />
            <circle cx="150" cy="150" r="62" fill="none" stroke="#E2E8F0" strokeWidth="1.5" opacity="0.9" />

            {/* Center Precision Bore */}
            <circle cx="150" cy="150" r="46" fill="url(#boreShadow)" stroke="#0284C7" strokeWidth="2" />
            <circle cx="150" cy="150" r="32" fill="#020617" />

            {/* Keyway Notch */}
            <rect x="144" y="100" width="12" height="18" fill="#020617" rx="2" />

            {/* Defect: Scratch across upper-left sector */}
            <path
              d="M 95 95 Q 110 110 120 125"
              stroke="url(#scratchGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 3px rgba(239,68,68,0.8))"
            />
          </svg>
        )}

        {/* AI Bounding Boxes (Inspection Result Screen Overlay) */}
        {showBoundingBoxes && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Defect 1: Scratch (Red Box) */}
            <div
              className="absolute border-2 border-red-500 rounded bg-red-500/15 flex flex-col justify-start"
              style={{ left: '20%', top: '22%', width: '40%', height: '36%' }}
            >
              <div className="self-start -mt-6 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Scratch 0.92
              </div>
            </div>

            {/* Bore OK (Green Box) */}
            <div
              className="absolute border-2 border-emerald-400 rounded bg-emerald-500/15"
              style={{ left: '46%', top: '26%', width: '40%', height: '42%' }}
            >
              <div className="self-end ml-auto -mt-6 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                OK 0.87
              </div>
            </div>
          </div>
        )}

        {/* Optical Scanning Laser Line Animation */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>

      {/* Camera Viewfinder Corners / Reticle */}
      {showReticle && (
        <div className="absolute inset-4 pointer-events-none">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />

          {/* Center Target Mark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border border-cyan-400/30 rounded-full" />
            <div className="w-2 h-2 bg-cyan-400/60 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};
