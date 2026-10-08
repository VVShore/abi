import React, { useState, useEffect } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Save,
  Lock,
  Download,
  Printer,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  CheckSquare,
  HelpCircle,
  Edit3,
  RotateCcw,
} from 'lucide-react';

interface ChecklistItem {
  label: string;
  question: string;
}

interface EvaluationSectionConfig {
  key: 'team' | 'market' | 'fit' | 'risk';
  number: number;
  id: string;
  jumpLabel: string;
  title: string;
  prompt: string;
  checklist: ChecklistItem[];
}

export const IndividualScorecardView: React.FC = () => {
  const {
    company,
    companies,
    activeCompanyId,
    setActiveCompanyId,
    setIsCompanyModalOpen,
    currentReviewer,
    reviewers,
    activeReviewerId,
    setActiveReviewerId,
    setCategoryRating,
    setSectionComment,
    saveProgress,
    submitScorecard,
    triggerToast,
    setIsPitchDeckModalOpen,
  } = useEvaluation();

  // State to track if user is actively revising a previously submitted scorecard
  const [isEditingSubmitted, setIsEditingSubmitted] = useState<boolean>(false);

  // Snapshot to support "Cancel Edits"
  const [snapshots, setSnapshots] = useState<{
    ratings: Record<string, number>;
    comments: Record<string, string>;
  } | null>(null);

  // Read-only state: true if submitted and user is not actively editing
  const isReadOnly = Boolean(currentReviewer.isSubmitted && !isEditingSubmitted);

  // Ratings for the 4 core categories: Team, Value Proposition, ABI Fit, Risk
  const [ratings, setRatings] = useState<Record<string, number>>({
    team: currentReviewer.categoryRatings?.team || 4,
    market: currentReviewer.categoryRatings?.market || 4,
    fit: currentReviewer.categoryRatings?.fit || 4,
    risk: currentReviewer.categoryRatings?.risk || 4,
  });

  // Comments for each of the 4 core categories
  const [comments, setComments] = useState<Record<string, string>>({
    team:
      currentReviewer.sectionComments?.team ||
      (activeCompanyId === 'vayim'
        ? 'Founders have communicated openly about training needs in microbiology. Receptive to committee guidance and eager to work with ACC bioscience faculty.'
        : ''),
    market:
      currentReviewer.sectionComments?.market ||
      (activeCompanyId === 'vayim'
        ? 'Strong clinical pull from regional ENT physicians. Solution fits into existing in-office catheter workflows without expensive capital equipment.'
        : ''),
    fit:
      currentReviewer.sectionComments?.fit ||
      (activeCompanyId === 'vayim'
        ? 'Ideal match for ABI wet lab benches and BSL-2 spectrophotometer access. Founders committed to hiring ACC biotechnology student interns.'
        : ''),
    risk:
      currentReviewer.sectionComments?.risk ||
      (activeCompanyId === 'vayim'
        ? 'FDA 510(k) pathway has identifiable predicates. IP filings are robust with 2 provisional applications in place.'
        : ''),
  });

  // Dynamic auto-save status: "Draft - Last saved 1 min ago"
  const [lastSavedLabel, setLastSavedLabel] = useState<string>(
    currentReviewer.lastSavedAt || '1 min ago'
  );

  // Active section for sticky jump-bar highlighting
  const [activeSectionId, setActiveSectionId] = useState<string>('section-1');

  // Sync state when active reviewer or active company changes
  useEffect(() => {
    setIsEditingSubmitted(false);
    setSnapshots(null);
    setRatings({
      team: currentReviewer.categoryRatings?.team || 4,
      market: currentReviewer.categoryRatings?.market || 4,
      fit: currentReviewer.categoryRatings?.fit || 4,
      risk: currentReviewer.categoryRatings?.risk || 4,
    });
    setComments({
      team:
        currentReviewer.sectionComments?.team ||
        (activeCompanyId === 'vayim'
          ? 'Founders have communicated openly about training needs in microbiology. Receptive to committee guidance and eager to work with ACC bioscience faculty.'
          : ''),
      market:
        currentReviewer.sectionComments?.market ||
        (activeCompanyId === 'vayim'
          ? 'Strong clinical pull from regional ENT physicians. Solution fits into existing in-office catheter workflows without expensive capital equipment.'
          : ''),
      fit:
        currentReviewer.sectionComments?.fit ||
        (activeCompanyId === 'vayim'
          ? 'Ideal match for ABI wet lab benches and BSL-2 spectrophotometer access. Founders committed to hiring ACC biotechnology student interns.'
          : ''),
      risk:
        currentReviewer.sectionComments?.risk ||
        (activeCompanyId === 'vayim'
          ? 'FDA 510(k) pathway has identifiable predicates. IP filings are robust with 2 provisional applications in place.'
          : ''),
    });
    setLastSavedLabel(currentReviewer.lastSavedAt || '1 min ago');
  }, [currentReviewer.id, currentReviewer.isSubmitted, activeCompanyId]);

  // Track active section as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['section-1', 'section-2', 'section-3', 'section-4'];
      const scrollPosition = window.pageYOffset + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle rating change (blocked when read-only)
  const handleRatingChange = (categoryKey: string, score: number) => {
    if (isReadOnly) return;
    setRatings((prev) => ({ ...prev, [categoryKey]: score }));
    setCategoryRating(categoryKey, score);
  };

  // Handle comment change (blocked when read-only)
  const handleCommentChange = (categoryKey: string, text: string) => {
    if (isReadOnly) return;
    setComments((prev) => ({ ...prev, [categoryKey]: text }));
    setSectionComment(categoryKey, text);
  };

  // Toggle edit mode for a submitted scorecard
  const handleStartEditing = () => {
    setSnapshots({
      ratings: { ...ratings },
      comments: { ...comments },
    });
    setIsEditingSubmitted(true);
    triggerToast('Edit Mode Enabled', 'Form fields unlocked. You can now revise your evaluation.', 'info');
  };

  // Cancel active edits and revert to submitted snapshot
  const handleCancelEdits = () => {
    if (snapshots) {
      setRatings(snapshots.ratings);
      setComments(snapshots.comments);
      Object.entries(snapshots.ratings).forEach(([key, val]) => setCategoryRating(key, val));
      Object.entries(snapshots.comments).forEach(([key, val]) => setSectionComment(key, val));
    }
    setIsEditingSubmitted(false);
    setSnapshots(null);
    triggerToast('Edits Cancelled', 'Reverted changes back to your submitted scorecard.', 'info');
  };

  // Save updated submission and return to submitted read-only state
  const handleUpdateAndResubmit = () => {
    submitScorecard();
    setIsEditingSubmitted(false);
    setSnapshots(null);
    setLastSavedLabel('just now');
    triggerToast('Scorecard Updated', 'Your revised scorecard has been re-submitted to the committee record.', 'success');
  };

  // 4 Core Evaluation Categories Strictly Defined
  const evaluationSections: EvaluationSectionConfig[] = [
    {
      key: 'team',
      number: 1,
      id: 'section-1',
      jumpLabel: '1. Team',
      title: 'Team',
      prompt: 'Prompt: If given the opportunity to mentor or work with this company, I definitely would.',
      checklist: [
        {
          label: 'Coachability',
          question: 'Are they open to feedback & mentoring?',
        },
        {
          label: 'Qualifications/Experience',
          question: "Do I think they're qualified to succeed?",
        },
        {
          label: 'Team Skillset Diversity & Advisors',
          question: 'How much help does their team need?',
        },
      ],
    },
    {
      key: 'market',
      number: 2,
      id: 'section-2',
      jumpLabel: '2. Value Prop',
      title: 'Value Proposition',
      prompt: 'Prompt: If I were a target customer, I would buy this product or service.',
      checklist: [
        {
          label: 'Product-Market Fit',
          question: 'Is this solution viable, desirable, and feasible?',
        },
        {
          label: 'Competitive Advantage',
          question: 'Is this solution significantly better than current alternatives?',
        },
        {
          label: 'Traction & Existing Customers',
          question: 'Is there market interest/validation?',
        },
        {
          label: 'Ecosystem Connections',
          question: 'Do they have industry leads/feedback?',
        },
      ],
    },
    {
      key: 'fit',
      number: 3,
      id: 'section-3',
      jumpLabel: '3. ABI Fit',
      title: 'ABI Fit',
      prompt: 'Prompt: I believe ABI has the appropriate resources and should help this company.',
      checklist: [
        {
          label: 'Lab space needs',
          question: 'Does company need equipment ABI provides?',
        },
        {
          label: 'ABI Fit',
          question: "Would I want to see this company on ABI's website?",
        },
        {
          label: 'Student Work',
          question: 'Do they want to work with ACC students/faculty/staff?',
        },
        {
          label: 'Good Citizen',
          question: 'Do they seem agreeable and cooperative?',
        },
      ],
    },
    {
      key: 'risk',
      number: 4,
      id: 'section-4',
      jumpLabel: '4. Risk',
      title: 'Risk',
      prompt: 'Prompt: I would invest my own money in this company.',
      checklist: [
        {
          label: 'Regulatory Risks/Barriers',
          question: 'Ability to operate efficiently or with undue risk?',
        },
        {
          label: 'Commercial Readiness',
          question: 'Working, well-defined offering that can be purchased?',
        },
        {
          label: 'Intellectual Property Status/Risk',
          question: 'Do they have legal protection for their unique value?',
        },
        {
          label: 'Funding & Capital',
          question: 'Investment(s) to date? Would an investor give them money?',
        },
        {
          label: 'Revenue & Burn Rate',
          question: 'Would I trust them to manage investment efficiently/effectively?',
        },
      ],
    },
  ];

  // Exact 1-5 rating scale labels
  const ratingScaleLabels = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ];

  // Calculate completed sections (out of 4 core sections)
  const isSectionComplete = (key: string) => Boolean(ratings[key] && ratings[key] > 0);

  const completedSectionsCount = [
    isSectionComplete('team'),
    isSectionComplete('market'),
    isSectionComplete('fit'),
    isSectionComplete('risk'),
  ].filter(Boolean).length;

  const progressPercentage = Math.round((completedSectionsCount / 4) * 100);

  // Smooth scroll directly to section header with proper offset
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -150; // offset for top banner header (h-20) + sticky jump bar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Save draft handler (for initial draft mode)
  const handleSaveDraft = () => {
    saveProgress();
    setLastSavedLabel('just now');
  };

  // Submit final scorecard handler (for initial draft mode)
  const handleSubmitFinal = () => {
    submitScorecard();
    setLastSavedLabel('just now');
  };

  // Print scorecard
  const handlePrint = () => {
    window.print();
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = `ACC Bioscience Incubator - Individual Scorecard\n`;
    csv += `Company,${company.name}\n`;
    csv += `Domain,${company.domain}\n`;
    csv += `Pitch Date,${company.reviewDate}\n`;
    csv += `Evaluator,${currentReviewer.name} (${currentReviewer.title})\n`;
    csv += `Status,${currentReviewer.isSubmitted ? 'Submitted' : 'Draft'}\n\n`;
    csv += `Section,Rating (1-5),Rating Label,Reviewer Notes & Select Quotes\n`;
    evaluationSections.forEach((s) => {
      const val = ratings[s.key] || 0;
      const label = ratingScaleLabels.find((r) => r.value === val)?.label || 'Unrated';
      csv += `"${s.title}",${val},"${label}","${(comments[s.key] || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${company.name}_Scorecard_${currentReviewer.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Scorecard Exported', 'CSV scorecard downloaded successfully.');
  };

  return (
    <div className="w-full pt-6 sm:pt-8 pb-32 bg-[#F8FAFD] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Sticky Company Reference Panel                                */}
          {/* ========================================================================= */}
          <aside className="w-full lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-24 space-y-5">
            {/* Company Overview Card */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#431A4D] via-[#78BE20] to-[#431A4D]" />

              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#431A4D] text-white">
                  Cohort 2026.1
                </span>
                <span className="text-xs font-bold text-slate-500">Applicant Reference</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {company.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                {company.domain}
              </p>

              <div className="my-5 pt-4 border-t border-slate-100 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#78BE20]" />
                    Pitch Date
                  </span>
                  <span className="font-bold text-slate-900">{company.reviewDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#431A4D]" />
                    Review Round
                  </span>
                  <span className="font-bold text-slate-900">{company.round}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Admission Bar
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    &ge; {company.thresholdScore.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              {/* View/Preview Pitch Deck PDF Button (min 44px height) */}
              <button
                type="button"
                onClick={() => setIsPitchDeckModalOpen(true)}
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-slate-900 hover:bg-[#431A4D] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#78BE20] focus:ring-offset-2"
                aria-label="Preview Pitch Deck PDF"
              >
                <FileText className="w-4 h-4 text-[#78BE20]" />
                <span>Preview Pitch Deck (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
              </button>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(true)}
                  className="text-xs font-semibold text-slate-500 hover:text-[#431A4D] transition-colors cursor-pointer py-1"
                >
                  Switch Company Profile ({companies.length} loaded)
                </button>
              </div>
            </div>

            {/* Steering Committee Panel */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#431A4D]" />
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Steering Committee
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {reviewers.length} Members
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Reviewers evaluating this applicant. Click any member to switch perspective:
              </p>

              <div className="space-y-2">
                {reviewers.map((rev) => {
                  const isActive = rev.id === activeReviewerId;
                  return (
                    <button
                      key={rev.id}
                      type="button"
                      onClick={() => setActiveReviewerId(rev.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#F4EBF7] border-[#431A4D] shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isActive
                            ? 'bg-[#431A4D] text-white'
                            : 'bg-white text-slate-700 border border-slate-300'
                        }`}
                      >
                        {rev.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{rev.name}</span>
                          {isActive && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#431A4D] text-white">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{rev.title}</div>
                      </div>

                      <div className="shrink-0">
                        {rev.isSubmitted ? (
                          <span
                            className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"
                            title="Scorecard Submitted"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-amber-400 block"
                            title="Draft in progress"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Utility Exports */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Export evaluation to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Print scorecard"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Individual Scorecard Form (4 Core Categories Only)           */}
          {/* ========================================================================= */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* Form Header with Status and Progress Indicator */}
            <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D]">
                      Individual Review Scorecard
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      Evaluator: <strong className="text-slate-900">{currentReviewer.name}</strong> ({currentReviewer.title})
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Committee Deliberation &amp; Rating
                  </h1>
                </div>

                {/* Status Indicator: "Submitted - Read-Only" or "Draft - Last saved..." */}
                <div className="shrink-0 flex items-center gap-2">
                  {isReadOnly ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border-2 border-emerald-200 font-bold text-xs sm:text-sm shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Submitted - Read-Only</span>
                    </span>
                  ) : isEditingSubmitted ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 text-[#431A4D] border-2 border-purple-200 font-bold text-xs sm:text-sm shadow-2xs">
                      <Clock className="w-4 h-4 text-[#431A4D]" />
                      <span>Editing Submission</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-900 border-2 border-amber-200 font-bold text-xs sm:text-sm shadow-2xs">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Draft - Last saved {lastSavedLabel}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Submission Progress Tracker: "0 of 4 sections complete" */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#78BE20]" />
                    <span>Evaluation Progress</span>
                  </span>
                  <span className="text-sm font-black text-[#431A4D]">
                    {completedSectionsCount} of 4 sections complete ({progressPercentage}%)
                  </span>
                </div>

                {/* Accessible Progress Bar */}
                <div
                  className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Scorecard completion progress"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#431A4D] to-[#78BE20] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STICKY SECTION JUMP-BAR: Links to 1. Team, 2. Value Prop, 3. ABI Fit, 4. Risk */}
            {/* ========================================================================= */}
            <nav
              aria-label="Scorecard sections quick jump"
              className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-2 border-slate-200/90 rounded-2xl p-2 shadow-sm flex items-center justify-between gap-2 overflow-x-auto"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                {evaluationSections.map((sec) => {
                  const isDone = isSectionComplete(sec.key);
                  const isCurrent = activeSectionId === sec.id;

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#431A4D] text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                      }`}
                    >
                      <span>{sec.jumpLabel}</span>
                      {isDone && (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-[#78BE20] text-slate-950'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* ========================================================================= */}
            {/* EXACTLY 4 CORE EVALUATION SECTIONS                                         */}
            {/* ========================================================================= */}
            {evaluationSections.map((sec) => {
              const currentRating = ratings[sec.key] || 0;
              const currentComment = comments[sec.key] || '';
              const isSectionDone = isSectionComplete(sec.key);

              return (
                <section
                  key={sec.key}
                  id={sec.id}
                  className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-6 sm:p-8 transition-colors hover:border-slate-300 scroll-mt-40"
                  aria-labelledby={`heading-${sec.id}`}
                >
                  {/* Category Section Header */}
                  <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#431A4D] text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                        {sec.number}
                      </div>
                      <div>
                        <h2
                          id={`heading-${sec.id}`}
                          className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
                        >
                          Section {sec.number}: {sec.title}
                        </h2>
                      </div>
                    </div>

                    {isSectionDone && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Complete
                      </span>
                    )}
                  </div>

                  {/* Header Prompt Box (Primary Category Standard) */}
                  <div className="mb-4 p-4.5 rounded-2xl bg-purple-50/70 border-2 border-purple-200/80">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D] mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#431A4D]" />
                      <span>Category Standard</span>
                    </div>
                    <div className="text-base sm:text-lg text-slate-950 font-bold leading-relaxed">
                      {sec.prompt}
                    </div>
                  </div>

                  {/* Helper Checklist: Clean, borderless neutral light-grey container with simple bulleted list */}
                  <div className="mb-6 p-4.5 sm:p-5 rounded-2xl bg-slate-100/70 border border-slate-200/60">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Factors to Consider</span>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {sec.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-slate-400 font-bold select-none leading-tight mt-1">•</span>
                          <span className="leading-snug">
                            <strong className="font-bold text-slate-900">{item.label}:</strong>{' '}
                            <span className="text-slate-600">{item.question}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 1-5 Rating Scale Control: 1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly Agree */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="block text-sm font-extrabold text-slate-900">
                        Rating (1–5 Scale) <span className="text-rose-600">*</span>
                      </label>
                      {currentRating > 0 && (
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-md font-mono ${
                            isReadOnly
                              ? 'bg-slate-700 text-white'
                              : 'bg-[#431A4D] text-white'
                          }`}
                        >
                          Selected: {currentRating} —{' '}
                          {ratingScaleLabels.find((r) => r.value === currentRating)?.label}
                        </span>
                      )}
                    </div>

                    {/* Scale legend text matching client spec: 1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly Agree */}
                    <div className="hidden sm:flex items-center justify-between text-[11px] font-extrabold text-slate-500 mb-2 px-1">
                      <span>1 = Strongly Disagree</span>
                      <span>2 = Disagree</span>
                      <span>3 = Neutral</span>
                      <span>4 = Agree</span>
                      <span>5 = Strongly Agree</span>
                    </div>

                    {/* Touch-Friendly 1-5 Rating Buttons (Minimum 44px) */}
                    <div
                      className="grid grid-cols-5 gap-2 sm:gap-3"
                      role="radiogroup"
                      aria-label={`${sec.title} rating scale from 1 to 5`}
                    >
                      {ratingScaleLabels.map((r) => {
                        const isSelected = currentRating === r.value;

                        return (
                          <button
                            key={r.value}
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => handleRatingChange(sec.key, r.value)}
                            role="radio"
                            aria-checked={isSelected}
                            aria-disabled={isReadOnly}
                            className={`min-h-[58px] sm:min-h-[64px] rounded-2xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 transition-all ${
                              isReadOnly
                                ? isSelected
                                  ? 'bg-[#431A4D] text-white border-[#431A4D] shadow-xs cursor-default font-black'
                                  : 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-default opacity-40 hover:bg-slate-100/70'
                                : isSelected
                                ? 'bg-[#431A4D] text-white border-[#34143D] shadow-md scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#431A4D] focus:ring-offset-2'
                                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#431A4D] focus:ring-offset-2'
                            }`}
                          >
                            <span className="text-xl sm:text-2xl font-black font-mono leading-none">
                              {r.value}
                            </span>
                            <span
                              className={`text-[9px] sm:text-[11px] font-bold mt-1 text-center truncate max-w-full px-1 ${
                                isSelected
                                  ? 'text-white/95'
                                  : isReadOnly
                                  ? 'text-slate-400'
                                  : 'text-slate-600'
                              }`}
                            >
                              {r.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviewer Notes & Select Quotes Textarea */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label
                        htmlFor={`comments-${sec.key}`}
                        className="text-sm font-extrabold text-slate-900 flex items-center gap-2"
                      >
                        <span>Reviewer Notes &amp; Select Quotes</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {isReadOnly && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                            <Lock className="w-3 h-3 text-slate-400" /> Locked (Read-Only)
                          </span>
                        )}
                        {!isReadOnly && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <Lock className="w-3 h-3 text-slate-400" /> Internal Committee Only
                          </span>
                        )}
                      </div>
                    </div>

                    <textarea
                      id={`comments-${sec.key}`}
                      rows={3}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                      value={currentComment}
                      onChange={(e) => handleCommentChange(sec.key, e.target.value)}
                      placeholder={
                        isReadOnly
                          ? 'No notes recorded for this category.'
                          : `Document notes, verbatim quotes from the pitch, or key strengths/concerns regarding ${sec.title}...`
                      }
                      className={`w-full min-h-[96px] p-4 text-sm sm:text-base rounded-2xl transition-colors leading-relaxed ${
                        isReadOnly
                          ? 'bg-slate-100/90 border border-dashed border-slate-300 text-slate-800 font-medium cursor-default select-text focus:outline-none'
                          : 'bg-white text-slate-900 border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#431A4D] focus:border-[#431A4D] placeholder:text-slate-400 shadow-2xs'
                      }`}
                    />
                  </div>
                </section>
              );
            })}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTION BAR: Fixed Bottom Sticky Dock                                      */}
      {/* ========================================================================= */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/90 py-3.5 px-4 sm:px-8 shadow-2xl print:hidden"
        role="region"
        aria-label="Scorecard action bar"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status & Reviewer Summary */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#431A4D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentReviewer.initials}
              </div>
              <span className="font-bold text-slate-900 truncate">
                {currentReviewer.name}
              </span>
            </div>

            <span className="text-slate-300">•</span>

            <span className="font-semibold text-slate-700">
              {completedSectionsCount} of 4 Complete
            </span>

            <span className="text-slate-300 hidden md:inline">•</span>

            <span className="hidden md:inline-flex items-center gap-1 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {isReadOnly
                ? 'Submitted - Read-Only'
                : isEditingSubmitted
                ? 'Editing Submission (Unsaved Changes)'
                : `Draft - Last saved ${lastSavedLabel}`}
            </span>
          </div>

          {/* Action Buttons: Responsive to Submission and Edit State */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isReadOnly ? (
              /* When Final Scorecard Submitted: Replace buttons with single secondary outlined "Edit Submission" */
              <button
                type="button"
                onClick={handleStartEditing}
                className="flex-1 sm:flex-none min-h-[44px] px-6 py-2.5 rounded-2xl border-2 border-slate-300 hover:border-[#431A4D] bg-white text-slate-800 hover:text-[#431A4D] hover:bg-slate-50 font-bold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#431A4D]"
                aria-label="Unlock and edit scorecard submission"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Edit Submission</span>
              </button>
            ) : isEditingSubmitted ? (
              /* When Actively Revising a Submitted Scorecard: "Cancel Edits" & "Update & Re-Submit Scorecard" */
              <>
                <button
                  type="button"
                  onClick={handleCancelEdits}
                  className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-2xl border-2 border-slate-300 hover:border-rose-400 bg-white text-slate-700 hover:text-rose-700 hover:bg-rose-50/50 font-bold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                  aria-label="Cancel editing and revert changes"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Cancel Edits</span>
                </button>

                <button
                  type="button"
                  onClick={handleUpdateAndResubmit}
                  className="flex-1 sm:flex-none min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#431A4D] hover:bg-[#34143D] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#78BE20] focus:ring-offset-2"
                  aria-label="Update and re-submit final committee scorecard"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#78BE20]" />
                  <span>Update &amp; Re-Submit Scorecard</span>
                </button>
              </>
            ) : (
              /* Standard Initial Draft Mode: "Save Draft" & "Submit Final Scorecard" */
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-2xl border-2 border-slate-300 hover:border-slate-400 bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#431A4D]"
                  aria-label="Save scorecard draft"
                >
                  <Save className="w-4 h-4 text-slate-600" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  className="flex-1 sm:flex-none min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#431A4D] hover:bg-[#34143D] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#78BE20] focus:ring-offset-2"
                  aria-label="Submit final committee scorecard"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#78BE20]" />
                  <span>Submit Final Scorecard</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
