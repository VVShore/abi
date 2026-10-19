import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { FileSpreadsheet, ChevronDown, Check, Building2, Plus, Edit2 } from 'lucide-react';
import { AbiLogo } from './AbiLogo';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    currentReviewer,
    reviewers,
    activeReviewerId,
    setActiveReviewerId,
    addNewReviewer,
    companies,
    activeCompanyId,
    setActiveCompanyId,
    company,
    setIsCompanyModalOpen,
  } = useEvaluation();

  const [showReviewerDropdown, setShowReviewerDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [isAddingReviewer, setIsAddingReviewer] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerTitle, setNewReviewerTitle] = useState('');

  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewerName.trim()) {
      addNewReviewer(newReviewerName.trim(), newReviewerTitle.trim() || 'Committee Evaluator');
      setNewReviewerName('');
      setNewReviewerTitle('');
      setIsAddingReviewer(false);
      setShowReviewerDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200/90 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
        {/* Brand Lockup with Official Wireframe Logo */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <AbiLogo size={40} showText={true} />

          {/* Portal Subtitle Tag */}
          <div className="hidden xl:flex items-center pl-3 border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-500">
              {activeScreen === 'individual'
                ? 'Applicant Review Scorecard'
                : activeScreen === 'committee'
                ? 'Committee Consensus & Scoring'
                : 'Founder Pitch Feedback'}
            </span>
          </div>
        </div>

        {/* Central Screen Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveScreen('individual')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeScreen === 'individual'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            Individual Scorecard
          </button>

          <button
            onClick={() => setActiveScreen('report')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeScreen === 'report'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Committee Highlights and Key Takeaways
          </button>

          <button
            onClick={() => setActiveScreen('committee')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeScreen === 'committee'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            Committee Summary
          </button>
        </nav>

        {/* Right Section: Company Switcher & Reviewer Selector */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Company Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCompanyDropdown(!showCompanyDropdown);
                setShowReviewerDropdown(false);
              }}
              className="flex items-center gap-2 bg-accent-light hover:bg-emerald-100 border border-accent-border px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left shadow-2xs"
              title="Select or edit applicant company"
            >
              <Building2 className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                  <span>Applicant</span>
                  <ChevronDown className="w-3 h-3 text-accent" />
                </div>
                <div className="text-xs font-black text-primary leading-tight max-w-[120px] sm:max-w-[140px] truncate">
                  {company.name}
                </div>
              </div>
            </button>

            {showCompanyDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">
                      Select Company
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Switch scorecard to another applicant
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompanyDropdown(false);
                      setIsCompanyModalOpen(true);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors"
                    title="Edit company information"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCompanyId(c.id);
                        setShowCompanyDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                        c.id === activeCompanyId
                          ? 'bg-accent-light text-primary font-bold border border-accent-border'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold text-slate-900 leading-snug truncate">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {c.domain}
                        </div>
                      </div>
                      {c.id === activeCompanyId && (
                        <Check className="w-4 h-4 text-accent shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompanyDropdown(false);
                      setIsCompanyModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-accent" />
                    <span>+ Add New Company</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reviewer Profile / Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowReviewerDropdown(!showReviewerDropdown);
                setShowCompanyDropdown(false);
              }}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentReviewer.initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>Reviewer</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-xs font-bold text-slate-900 leading-tight max-w-[100px] truncate">
                  {currentReviewer.name}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showReviewerDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    Active Evaluator
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Switch context to evaluate as any committee member
                  </div>
                </div>
                <div className="space-y-1">
                  {reviewers.map((rev) => (
                    <button
                      key={rev.id}
                      onClick={() => {
                        setActiveReviewerId(rev.id);
                        setShowReviewerDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                        rev.id === activeReviewerId
                          ? 'bg-accent-light text-primary font-bold border border-accent/30'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {rev.initials}
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-slate-900 leading-snug truncate">
                            {rev.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {rev.title}
                          </div>
                        </div>
                      </div>
                      {rev.id === activeReviewerId && (
                        <Check className="w-4 h-4 text-accent shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Add New Evaluator Section */}
                <div className="pt-2 mt-1 border-t border-slate-100">
                  {isAddingReviewer ? (
                    <form onSubmit={handleAddReviewer} className="p-2 bg-slate-50 rounded-xl space-y-2">
                      <div className="text-[11px] font-bold text-primary uppercase tracking-wider">
                        Add New Reviewer
                      </div>
                      <input
                        type="text"
                        autoFocus
                        required
                        placeholder="Reviewer Full Name (e.g. Dr. Alex Vance)"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                      <input
                        type="text"
                        placeholder="Role / Title (e.g. Scientific Advisor)"
                        value={newReviewerTitle}
                        onChange={(e) => setNewReviewerTitle(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingReviewer(false)}
                          className="flex-1 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-1 text-xs font-bold bg-primary text-white hover:bg-primary-hover rounded-md transition-colors"
                        >
                          Add Reviewer
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingReviewer(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 text-primary text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-accent" />
                      <span>+ Add New Reviewer</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Screen Switcher Bar */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveScreen('individual')}
          className={`flex-1 min-w-[110px] py-1.5 px-2 rounded-lg text-xs font-bold text-center cursor-pointer ${
            activeScreen === 'individual'
              ? 'bg-primary text-white shadow-2xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Scorecard
        </button>
        <button
          onClick={() => setActiveScreen('report')}
          className={`flex-1 min-w-[110px] py-1.5 px-2 rounded-lg text-xs font-bold text-center cursor-pointer ${
            activeScreen === 'report'
              ? 'bg-primary text-white shadow-2xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Committee Highlights
        </button>
        <button
          onClick={() => setActiveScreen('committee')}
          className={`flex-1 min-w-[110px] py-1.5 px-2 rounded-lg text-xs font-bold text-center cursor-pointer ${
            activeScreen === 'committee'
              ? 'bg-primary text-white shadow-2xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Committee Summary
        </button>
      </div>
    </header>
  );
};
