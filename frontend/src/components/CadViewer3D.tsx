import React, { useRef, useEffect, useState } from 'react';
import { RotateCw, Maximize2, Layers, Compass, Eye } from 'lucide-react';

interface CadViewer3DProps {
  partType?: string;
  showDefects?: boolean;
  className?: string;
}

export const CadViewer3D: React.FC<CadViewer3DProps> = ({
  partType = 'Gear Housing',
  showDefects = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [rotX, setRotX] = useState(0.45);
  const [rotY, setRotY] = useState(0.65);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // 3D Geometry generation (Industrial Gear / Flange with teeth and bore)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = rotY;

    // Generate vertices for an industrial machined gear
    const teeth = 18;
    const outerR = 85;
    const innerR = 72;
    const boreR = 34;
    const thickness = 38;

    const vertices: { x: number; y: number; z: number }[] = [];
    const faces: number[][] = [];

    // Create front and back rings with teeth
    for (const z of [-thickness / 2, thickness / 2]) {
      const zOffset = vertices.length;
      for (let i = 0; i < teeth * 2; i++) {
        const theta = (i * Math.PI) / teeth;
        const r = i % 2 === 0 ? outerR : innerR;
        vertices.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
          z,
        });
      }
      // Inner bore ring
      for (let i = 0; i < teeth; i++) {
        const theta = (i * 2 * Math.PI) / teeth;
        vertices.push({
          x: Math.cos(theta) * boreR,
          y: Math.sin(theta) * boreR,
          z,
        });
      }
    }

    const render = () => {
      // Auto-spin if enabled
      if (isRotating && !isDragging) {
        angle += 0.008;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const cosY = Math.cos(angle);
      const sinY = Math.sin(angle);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Project vertices to 2D screen
      const projected = vertices.map((v) => {
        // Rotate around Y
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.x * sinY + v.z * cosY;
        // Rotate around X
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = v.y * sinX + z1 * cosX;

        const fov = 400;
        const scale = fov / (fov + z2 + 180);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Draw Depth-sorted grid & part
      const numPoints = teeth * 2;

      // Draw gear teeth perimeter faces
      for (let i = 0; i < numPoints; i++) {
        const next = (i + 1) % numPoints;
        const p1 = projected[i];
        const p2 = projected[next];
        const p3 = projected[next + vertices.length / 2];
        const p4 = projected[i + vertices.length / 2];

        const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
        const shade = Math.floor(Math.max(20, Math.min(220, 110 + avgZ * 0.8)));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        if (wireframe) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${shade - 10}, ${shade + 15}, ${shade + 45})`;
          ctx.fill();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw front face ring
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const p = projected[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      if (!wireframe) {
        ctx.fillStyle = '#1e293b';
        ctx.fill();
      }
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw Inner Hub Bore
      const boreOffset = numPoints;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const p = projected[boreOffset + i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // 3D Inspection Points / Defect Marker pins
      if (showDefects) {
        const pinIdx = Math.floor(numPoints * 0.35);
        const pin = projected[pinIdx];

        // Pulsing defect ring
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, 14 * pin.scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, 4 * pin.scale, 0, Math.PI * 2);
        ctx.fill();

        // Pin Callout line
        ctx.beginPath();
        ctx.moveTo(pin.x, pin.y);
        ctx.lineTo(pin.x + 40, pin.y - 30);
        ctx.lineTo(pin.x + 95, pin.y - 30);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('CRACK #01 (0.94)', pin.x + 45, pin.y - 34);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [rotX, rotY, isRotating, isDragging, wireframe, showDefects]);

  // Mouse & Touch interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.012)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.012)));
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div
      className={`relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={420}
        height={320}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Left Status Badge */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
        <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>3D CAD Model • {partType}</span>
      </div>

      {/* Control Buttons Overlay */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWireframe(!wireframe);
          }}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
            wireframe
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title="Toggle Wireframe mode"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRotating(!isRotating);
          }}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
            isRotating
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title="Toggle Auto-Spin"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setRotX(0.45);
            setRotY(0.65);
          }}
          className="p-1.5 rounded-lg border bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white text-xs"
          title="Reset View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] text-slate-500 font-medium bg-slate-950/60 px-2 py-0.5 rounded">
        Drag to rotate 360°
      </div>
    </div>
  );
};
