import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, XCircle, Award, QrCode } from 'lucide-react';
import { InspectionItem } from '../context/AppContext';

interface QualityCertificateModalProps {
  item: InspectionItem;
  onClose: () => void;
}

export const QualityCertificateModal: React.FC<QualityCertificateModalProps> = ({ item, onClose }) => {
  const isPass = item.status === 'PASS';
  const certNumber = `CERT-${item.id.replace('ins-', '').toUpperCase()}-${new Date().getFullYear()}`;
  const inspectionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-none print:m-0">
        {/* Modal Toolbar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">ISO 9001 / IATF 16949 Certificate of Inspection</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (The formal printed document) */}
        <div className="p-8 space-y-6 text-slate-800 bg-white relative">
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <span className="text-9xl font-black rotate-[-25deg] uppercase">DEFEX.AI</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-blue-900">DEFEX.AI</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded">
                  Industrial Quality
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                CERTIFICATE OF CONFORMITY & INSPECTION
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Automated Vision Inspection System • ISO 9001:2015 & IATF 16949 Compliant
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Certificate No.</span>
              <span className="text-xs font-mono font-black text-slate-900">{certNumber}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Date: {inspectionDate}</span>
            </div>
          </div>

          {/* Summary Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Part & Station Info</span>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Part Identifier:</span>
                <span className="font-bold text-slate-900">{item.partId}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Component Class:</span>
                <span className="font-bold text-slate-900">{item.partType}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Inspection Machine:</span>
                <span className="font-bold text-slate-900">{item.machine}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-semibold text-slate-500">Cycle Duration:</span>
                <span className="font-bold text-slate-900">{item.duration}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Quality Metrics</span>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Confidence Score:</span>
                <span className="font-bold text-blue-600">{item.confidence}%</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Dimensional Tolerance:</span>
                <span className="font-bold text-slate-900">{item.dimensions}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Defects Count:</span>
                <span className={`font-bold ${isPass ? 'text-emerald-600' : 'text-red-600'}`}>
                  {item.defects && item.defects.length > 0 ? item.defects.length : '0 Detected'}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-semibold text-slate-500">Vision Algorithm:</span>
                <span className="font-bold text-slate-900">YOLOv8-Nano / Gradient Edge</span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isPass
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {isPass ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">Inspection Verdict</span>
                <span className="text-xl font-black">
                  {isPass ? 'CONFORMANT - PASS' : 'NON-CONFORMANT - REJECTED'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold block">Status Code</span>
              <span className="font-mono text-sm font-black tracking-widest">{item.status}</span>
            </div>
          </div>

          {/* Signatures & QR Code Footer */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 items-end">
            {/* QR verification */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-lg p-1.5 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-full h-full text-white" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-800 block">Digital Verification</span>
                Scan to verify on defex.ai verification portal.
              </div>
            </div>

            {/* Quality Lead Sign-off */}
            <div className="text-center">
              <div className="border-b border-slate-400 pb-1 font-serif italic text-slate-700 text-sm">
                Sanjay Kumar
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Quality Assurance Lead
              </span>
            </div>

            {/* Stamp */}
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-blue-600 text-blue-700 flex flex-col items-center justify-center rotate-[-12deg] shadow-xs">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="text-[7px] font-black uppercase tracking-tighter">VERIFIED</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                DefEx.ai Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
