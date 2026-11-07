import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  FileSpreadsheet,
  ChevronDown,
  Check,
  Building2,
  Plus,
  Edit2,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
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
    setIsImportModalOpen,
    activeMeeting,
    activeMeetingId,
    setActiveMeetingId,
    meetings,
    addProgressCheckin,
    createInitialPitch,
  } = useEvaluation();

  const [showReviewerDropdown, setShowReviewerDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showMeetingDropdown, setShowMeetingDropdown] = useState(false);

  const [isAddingReviewer, setIsAddingReviewer] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerTitle, setNewReviewerTitle] = useState('');

  const [isAddingCheckin, setIsAddingCheckin] = useState(false);
  const [newCheckinDate, setNewCheckinDate] = useState('');
  const [newCheckinTitle, setNewCheckinTitle] = useState('');

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

  const handleAddCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCheckinDate.trim()) {
      addProgressCheckin(newCheckinDate.trim(), newCheckinTitle.trim() || undefined);
      setNewCheckinDate('');
      setNewCheckinTitle('');
      setIsAddingCheckin(false);
      setShowMeetingDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200/90 shadow-xs print:hidden">
      {/* Top Row: Logo on left, Import, Applicant, Meeting, and Reviewer controls on right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
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

        {/* Right Section: Import, Applicant, Meeting, and Reviewer Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Quick Import Control */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-[#F2F9EC] border border-slate-200 hover:border-[#78BE20]/60 text-slate-700 hover:text-[#431A4D] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
            title="Import real ABI applications from local .xlsx workbook"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#78BE20]" />
            <span>Import (.xlsx)</span>
          </button>

          {/* Company Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCompanyDropdown(!showCompanyDropdown);
                setShowMeetingDropdown(false);
                setShowReviewerDropdown(false);
              }}
              className="flex items-center gap-2 bg-status-success-light hover:bg-prototype-detail-1 border border-accent/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left shadow-2xs"
              title="Select or edit applicant company"
            >
              <Building2 className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                  <span>Applicant</span>
                  <ChevronDown className="w-3 h-3 text-accent" />
                </div>
                <div className="text-xs font-black text-primary leading-tight max-w-[110px] sm:max-w-[130px] truncate">
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
                      Switch context to another applicant
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompanyDropdown(false);
                      setIsCompanyModalOpen(true);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors cursor-pointer"
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
                          ? 'bg-status-success-light text-primary font-bold border border-accent/40'
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

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompanyDropdown(false);
                      setIsImportModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F2F9EC] hover:bg-[#E5F5D6] text-[#431A4D] border border-[#78BE20]/40 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#78BE20]" />
                    <span>Import Applications (.xlsx)</span>
                  </button>
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

          {/* Meeting Selector Dropdown (Initial Pitch & Progress Check-in) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMeetingDropdown(!showMeetingDropdown);
                setShowCompanyDropdown(false);
                setShowReviewerDropdown(false);
                setIsAddingCheckin(false);
              }}
              className="flex items-center gap-2 bg-[#F8FAFD] hover:bg-slate-100 border border-slate-200 hover:border-[#78BE20]/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left shadow-2xs"
              title="Select or schedule evaluation meeting"
            >
              <Calendar className="w-4 h-4 text-[#431A4D]" />
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>Meeting</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-xs font-black text-[#431A4D] leading-tight max-w-[120px] sm:max-w-[150px] truncate">
                  {activeMeeting ? (
                    <span>
                      {activeMeeting.type === 'Initial Pitch' ? 'Initial Pitch' : 'Check-in'} ·{' '}
                      <span className="font-semibold text-slate-600">{activeMeeting.date}</span>
                    </span>
                  ) : (
                    'No Meeting'
                  )}
                </div>
              </div>
            </button>

            {showMeetingDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#431A4D] flex items-center justify-between">
                    <span>Company Meetings</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                      {company.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Initial Pitch & dated Progress Check-ins
                  </div>
                </div>

                {/* Meeting list */}
                <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
                  {meetings.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500">
                      No meetings recorded yet for {company.name}.
                    </div>
                  ) : (
                    meetings.map((m) => {
                      const isInitial = m.type === 'Initial Pitch';
                      const isActive = m.id === activeMeetingId;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setActiveMeetingId(m.id);
                            setShowMeetingDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#F2F9EC] text-[#431A4D] font-bold border border-[#78BE20]/40 shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                  isInitial
                                    ? 'bg-[#431A4D] text-white'
                                    : 'bg-[#78BE20]/20 text-[#431A4D] border border-[#78BE20]/40'
                                }`}
                              >
                                {isInitial ? 'Initial Pitch' : 'Check-in'}
                              </span>
                              <span className="font-bold text-slate-900 truncate">
                                {m.date}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {m.title}
                            </div>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 text-[#78BE20] shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Actions: Add Progress Check-in / Create Initial Pitch */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {isAddingCheckin ? (
                    <form onSubmit={handleAddCheckin} className="p-2.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                      <div className="text-[11px] font-bold text-[#431A4D] uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#78BE20]" />
                        <span>New Progress Check-in</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                          Check-in Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder="e.g. Apr 15, 2026 or Oct 10, 2026"
                          value={newCheckinDate}
                          onChange={(e) => setNewCheckinDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#78BE20]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                          Milestone / Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Q1 In-Vitro Assay Check-in"
                          value={newCheckinTitle}
                          onChange={(e) => setNewCheckinTitle(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#78BE20]"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingCheckin(false)}
                          className="flex-1 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-1 text-xs font-bold bg-[#431A4D] text-white hover:bg-[#34143D] rounded-md transition-colors cursor-pointer"
                        >
                          Save Check-in
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCheckinDate(
                            new Date().toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          );
                          setNewCheckinTitle('');
                          setIsAddingCheckin(true);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#431A4D] hover:bg-[#34143D] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#78BE20]" />
                        <span>+ Add Progress Check-in</span>
                      </button>

                      {!meetings.some((m) => m.type === 'Initial Pitch') && (
                        <button
                          type="button"
                          onClick={() => {
                            createInitialPitch();
                            setShowMeetingDropdown(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-[#431A4D]" />
                          <span>+ Create Initial Pitch</span>
                        </button>
                      )}
                    </>
                  )}
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
                setShowMeetingDropdown(false);
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
                          ? 'bg-status-success-light text-primary font-bold border border-accent/30'
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
                          className="flex-1 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-1 text-xs font-bold bg-primary text-white hover:bg-primary-hover rounded-md transition-colors cursor-pointer"
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

      {/* Separate Tab Bar Directly Below Top Row */}
      <div className="border-t border-slate-200/90 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2">
          <nav
            aria-label="Evaluation Views"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2"
          >
            <button
              type="button"
              onClick={() => setActiveScreen('individual')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeScreen === 'individual'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              <span>Individual Scorecard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen('report')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeScreen === 'report'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span>Committee Insights</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen('committee')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeScreen === 'committee'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">groups</span>
              <span>Feedback Summary</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
