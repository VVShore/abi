import React from 'react';
import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import { Header } from './components/Header';
import { IndividualScorecardView } from './components/IndividualScorecardView';
import { CommitteeSummaryView } from './components/CommitteeSummaryView';
import { PitchFeedbackReportView } from './components/PitchFeedbackReportView';
import { CompanyModal } from './components/CompanyModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { EmailModal } from './components/EmailModal';
import { Toast } from './components/Toast';
import { AbiLogo } from './components/AbiLogo';

const EvaluationMainContent: React.FC = () => {
  const { activeScreen } = useEvaluation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      {/* Top Banner Navigation Header */}
      <Header />

      {/* Main Screen Content */}
      <main className="flex-1 w-full">
        {activeScreen === 'individual' && <IndividualScorecardView />}
        {activeScreen === 'committee' && <CommitteeSummaryView />}
        {activeScreen === 'report' && <PitchFeedbackReportView />}
      </main>

      {/* Clean, Official Institutional Footer matching https://sites.austincc.edu/incubator/ */}
      <footer className="w-full bg-white border-t-2 border-slate-200/90 py-6 text-sm text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <AbiLogo size={28} />
            <a
              href="https://sites.austincc.edu/incubator/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-[#431A4D] hover:text-[#78BE20] transition-colors"
            >
              ACC Bioscience Incubator (ABI)
            </a>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">
              Austin Community College District
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">Wet Lab Space for Startups</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Confidential Assessment System</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              Cohort 2026.1
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals and Toasts */}
      <CompanyModal />
      <PitchDeckModal />
      <EmailModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <EvaluationProvider>
      <EvaluationMainContent />
    </EvaluationProvider>
  );
}
