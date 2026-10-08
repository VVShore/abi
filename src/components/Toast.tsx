import React from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useEvaluation();

  if (!toast || !toast.show) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-4 print:hidden">
      <div className="bg-[#141b2b] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 border-2 border-[#F0B323] min-w-[320px] max-w-md">
        {toast.type === 'success' && (
          <CheckCircle className="w-7 h-7 text-[#F0B323] shrink-0" />
        )}
        {toast.type === 'info' && (
          <Info className="w-7 h-7 text-[#F0B323] shrink-0" />
        )}
        {toast.type === 'warning' && (
          <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
        )}
        <div>
          <div className="font-bold text-base text-white">{toast.title}</div>
          <div className="text-sm text-slate-300 leading-snug">
            {toast.message}
          </div>
        </div>
      </div>
    </div>
  );
};
