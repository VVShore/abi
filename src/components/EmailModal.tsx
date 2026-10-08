import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { Mail, Send, X, CheckCircle, Clock } from 'lucide-react';

export const EmailModal: React.FC = () => {
  const { isEmailModalOpen, setIsEmailModalOpen, company, committeeMatrix, triggerToast } = useEvaluation();
  const [recipient, setRecipient] = useState('phil.tetzlaff@vayimbio.com');
  const [subject, setSubject] = useState(
    'ACC Bioscience Incubator — Admission Offer & Venture Committee Feedback Report'
  );
  const [isSending, setIsSending] = useState(false);

  if (!isEmailModalOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsEmailModalOpen(false);
      triggerToast(
        'Feedback Report Sent',
        `Admission offer and pitch feedback emailed successfully to ${recipient}!`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#4D1979] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#F0B323]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Email Report to Founders</h3>
              <p className="text-xs text-purple-200">
                Official transmission from ACC Bioscience Incubator Review Board
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmailModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Recipient Email(s)
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D1979] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D1979] font-medium"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wide border-b border-slate-200 pb-2">
              <span>Attached Documents &amp; Metrics</span>
              <span className="text-[#2e7d32]">Exceeds Bar (3.50)</span>
            </div>

            <div className="text-sm space-y-1.5 text-slate-700">
              <p>
                <strong>Company:</strong> {company.name} ({company.domain})
              </p>
              <p>
                <strong>Decision:</strong>{' '}
                <span className="text-[#2e7d32] font-bold">
                  Accepted for Admission (Score: {committeeMatrix.categoryAverages.total.toFixed(1)} / 5.0)
                </span>
              </p>
              <p>
                <strong>Target Move-In Date:</strong> February 15, 2026
              </p>
              <p className="text-xs text-slate-500 pt-1">
                Includes full breakdown of the 4 key evaluation categories, 5 steering committee reviewer quotes, and the 5 pre-incubation action priorities.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <button
            onClick={() => setIsEmailModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={isSending}
            className="inline-flex items-center gap-2 bg-[#F0B323] hover:bg-[#e0a418] text-[#2c1e00] font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send to Founders</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
