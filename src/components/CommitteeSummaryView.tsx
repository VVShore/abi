import React, { useState, useEffect, useMemo } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { FeedbackSectionData, ValidatedQuoteRef } from '../types';
import { requestDemoDraft } from '../api/aiClient';
import { getSubmittedReviewers } from '../utils/scoringCalculations';
import { resolveSectionQuoteRefs, buildDeterministicMeetingDraft } from '../utils/quoteProvenance';
import {
  FileText,
  Edit3,
  Check,
  Download,
  Plus,
  Trash2,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

const formatReportSectionHeading = (section: FeedbackSectionData): string => {
  switch (section.id) {
    case 'overall':
      return 'OVERALL FEEDBACK';
    case 'team':
      return 'TEAM';
    case 'value_prop':
      return 'VALUE PROPOSITION';
    case 'abi_fit':
      return 'ABI FIT';
    case 'risk':
      return 'RISK';
    default:
      return section.title.replace(/^FEEDBACK ON\s+/i, '').toUpperCase();
  }
};

const NancyReportLogoLockup: React.FC = () => (
  <div className="inline-flex items-center gap-4 select-none">
    <svg
      width={86}
      height={86}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-[#78BE20]"
    >
      <line x1="50" y1="12" x2="22" y2="35" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="50" y1="12" x2="78" y2="35" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="22" y1="35" x2="16" y2="70" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="78" y1="35" x2="84" y2="70" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="70" x2="50" y2="92" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="84" y1="70" x2="50" y2="92" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

      <line x1="50" y1="12" x2="38" y2="52" stroke="currentColor" strokeWidth="1.8" />
      <line x1="50" y1="12" x2="62" y2="52" stroke="currentColor" strokeWidth="1.8" />
      <line x1="22" y1="35" x2="38" y2="52" stroke="currentColor" strokeWidth="1.8" />
      <line x1="78" y1="35" x2="62" y2="52" stroke="currentColor" strokeWidth="1.8" />
      <line x1="38" y1="52" x2="62" y2="52" stroke="currentColor" strokeWidth="2.2" />
      <line x1="38" y1="52" x2="16" y2="70" stroke="currentColor" strokeWidth="1.8" />
      <line x1="62" y1="52" x2="84" y2="70" stroke="currentColor" strokeWidth="1.8" />
      <line x1="38" y1="52" x2="50" y2="92" stroke="currentColor" strokeWidth="1.8" />
      <line x1="62" y1="52" x2="50" y2="92" stroke="currentColor" strokeWidth="1.8" />
      <line x1="22" y1="35" x2="62" y2="52" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
      <line x1="78" y1="35" x2="38" y2="52" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
      <line x1="16" y1="70" x2="84" y2="70" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />

      <circle cx="50" cy="12" r="3.8" fill="currentColor" />
      <circle cx="22" cy="35" r="3.4" fill="currentColor" />
      <circle cx="78" cy="35" r="3.4" fill="currentColor" />
      <circle cx="16" cy="70" r="3.4" fill="currentColor" />
      <circle cx="84" cy="70" r="3.4" fill="currentColor" />
      <circle cx="50" cy="92" r="3.8" fill="currentColor" />
      <circle cx="38" cy="52" r="3.4" fill="currentColor" />
      <circle cx="62" cy="52" r="3.4" fill="currentColor" />
    </svg>

    <div className="flex flex-col text-left leading-none font-sans">
      <span className="text-[14px] sm:text-[15px] font-normal tracking-[0.04em] uppercase text-[#4E616B]">
        AUSTIN COMMUNITY COLLEGE
      </span>
      <span className="text-[24px] sm:text-[27px] font-extrabold tracking-[0.06em] uppercase text-[#78BE20] leading-[1.04] mt-0.5">
        BIOSCIENCE
      </span>
      <span className="text-[24px] sm:text-[27px] font-extrabold tracking-[0.08em] uppercase text-[#4A5D67] leading-[1.04]">
        INCUBATOR
      </span>
    </div>
  </div>
);

export const CommitteeSummaryView: React.FC = () => {
  const {
    company,
    activeMeeting,
    activeMeetingId,
    activeCompanyId,
    triggerToast,
    activeMeetingFeedback,
    updateMeetingFeedback,
    createGenerationToken,
    applyGeneratedFeedbackDraft,
  } = useEvaluation();

  const [isEditing, setIsEditing] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);

  const submittedReviewers = useMemo(() => {
    return getSubmittedReviewers(activeMeeting);
  }, [activeMeeting]);

  // Single Source of Truth: local working copy initialized from activeMeetingFeedback
  const [sections, setSections] = useState<FeedbackSectionData[]>(activeMeetingFeedback);
  const [isDirty, setIsDirty] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Overwrite confirmation modal state
  const [isOverwriteModalOpen, setIsOverwriteModalOpen] = useState(false);
  const [pendingGenerationAction, setPendingGenerationAction] = useState<(() => void) | null>(null);

  // Header metadata display
  const [companyNameDisplay, setCompanyNameDisplay] = useState<string>(company.name || 'Solaris Biotherapeutics');
  const [pitchDateDisplay, setPitchDateDisplay] = useState<string>(
    activeMeeting?.date || company.reviewDate || 'Feb 12, 2026'
  );

  // Synchronize when meeting or company switches
  useEffect(() => {
    setSections(activeMeetingFeedback);
    setIsDirty(false);
    setCompanyNameDisplay(company.name);
    setPitchDateDisplay(activeMeeting?.date || company.reviewDate || 'Feb 12, 2026');
  }, [activeCompanyId, activeMeetingId, activeMeetingFeedback, company.name, company.reviewDate, activeMeeting?.date]);

  // Close PDF preview modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPdfPreviewOpen && e.key === 'Escape') {
        setIsPdfPreviewOpen(false);
      }
      if (isOverwriteModalOpen && e.key === 'Escape') {
        setIsOverwriteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPdfPreviewOpen, isOverwriteModalOpen]);

  const handleSummaryChange = (id: string, newSummary: string) => {
    setIsDirty(true);
    setSections((prev) => {
      const updated = prev.map((sec) => (sec.id === id ? { ...sec, summary: newSummary } : sec));
      updateMeetingFeedback(activeMeetingId, updated);
      return updated;
    });
  };

  const handleQuoteChange = (sectionId: string, quoteIdx: number, newQuoteText: string) => {
    setIsDirty(true);
    setSections((prev) => {
      const updated = prev.map((sec) => {
        if (sec.id !== sectionId) return sec;

        const baseRefs =
          sec.quoteRefs && sec.quoteRefs.length > 0
            ? [...sec.quoteRefs]
            : resolveSectionQuoteRefs(sec, submittedReviewers);

        if (baseRefs[quoteIdx]) {
          baseRefs[quoteIdx] = {
            ...baseRefs[quoteIdx],
            quote: newQuoteText,
            verificationStatus: 'edited',
          };
        }

        const updatedQuotes = baseRefs.map((r) => r.quote);
        return { ...sec, quotes: updatedQuotes, quoteRefs: baseRefs };
      });

      updateMeetingFeedback(activeMeetingId, updated);
      return updated;
    });
  };

  const handleAddQuote = (sectionId: string) => {
    setIsDirty(true);
    setSections((prev) => {
      const updated = prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const baseRefs =
          sec.quoteRefs && sec.quoteRefs.length > 0
            ? [...sec.quoteRefs]
            : resolveSectionQuoteRefs(sec, submittedReviewers);
        const newRef: ValidatedQuoteRef = {
          id: `custom_quote_${Date.now()}`,
          quote: 'New custom reviewer feedback or observation...',
          reviewerId: 'custom',
          reviewerName: 'Committee Member',
          reviewerRole: 'Steering Committee',
          verificationStatus: 'edited',
        };
        const nextRefs = [...baseRefs, newRef];
        return {
          ...sec,
          quotes: nextRefs.map((r) => r.quote),
          quoteRefs: nextRefs,
        };
      });

      updateMeetingFeedback(activeMeetingId, updated);
      return updated;
    });
  };

  const handleRemoveQuote = (sectionId: string, quoteIdx: number) => {
    setIsDirty(true);
    setSections((prev) => {
      const updated = prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const baseRefs =
          sec.quoteRefs && sec.quoteRefs.length > 0
            ? [...sec.quoteRefs]
            : resolveSectionQuoteRefs(sec, submittedReviewers);
        const nextRefs = baseRefs.filter((_, idx) => idx !== quoteIdx);
        return {
          ...sec,
          quotes: nextRefs.map((r) => r.quote),
          quoteRefs: nextRefs,
        };
      });

      updateMeetingFeedback(activeMeetingId, updated);
      return updated;
    });
  };

  // Execute demo synthetic draft generation (strictly isolated per company & meeting)
  const executeDemoGeneration = async () => {
    const token = createGenerationToken();
    setIsGenerating(true);

    try {
      if (activeCompanyId === 'solaris_bio') {
        const res = await requestDemoDraft('FIXTURE_SYNTHETIC_SOLARIS_2026', token);
        if (res.success && res.sections) {
          const applied = applyGeneratedFeedbackDraft(activeMeetingId, res.sections, token);
          if (applied) {
            setSections(res.sections);
            setIsDirty(false);
            triggerToast(
              'Demo Summary Generated',
              'Loaded deterministic synthetic draft based on synthetic committee scorecards.',
              'success'
            );
          }
        } else {
          triggerToast('Generation Failed', res.error || 'Failed to generate demo draft', 'warning');
        }
      } else {
        const meetingDraft = buildDeterministicMeetingDraft(
          company.name,
          activeMeeting?.title || 'Initial Pitch',
          submittedReviewers
        );
        const applied = applyGeneratedFeedbackDraft(activeMeetingId, meetingDraft, token);
        if (applied) {
          setSections(meetingDraft);
          setIsDirty(false);
          triggerToast(
            'Demo Summary Generated',
            `Synthesized deterministic draft for ${company.name} (${activeMeeting?.title || 'Meeting'}).`,
            'success'
          );
        }
      }
    } catch (err: any) {
      triggerToast('Generation Error', err.message || 'Error communicating with local server', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger generation with overwrite confirmation guard
  const handleTriggerDemoGeneration = () => {
    if (isDirty || sections.some((s) => s.summary && s.summary.length > 30)) {
      setPendingGenerationAction(() => () => executeDemoGeneration());
      setIsOverwriteModalOpen(true);
    } else {
      executeDemoGeneration();
    }
  };

  const handleOpenPdfPreview = () => {
    if (isEditing) setIsEditing(false);
    setIsPdfPreviewOpen(true);
  };

  const handlePrintPDF = () => {
    if (isEditing) setIsEditing(false);
    if (isPdfPreviewOpen) setIsPdfPreviewOpen(false);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    setIsDirty(false);
    updateMeetingFeedback(activeMeetingId, sections);
    triggerToast(
      'Meeting Draft Saved',
      `Feedback Summary for "${activeMeeting?.title || company.name}" saved and persisted across screen and PDF.`,
      'success'
    );
  };

  /**
   * Shared 1:1 report template matching Nancy's supplied PDF:
   * C:\Users\salaz\Downloads\Example 1- Feedback Report GAPS-2.pdf
   * Used identically by the on-screen document view, Preview PDF, and Export PDF.
   */
  const renderNancyReportDocument = () => (
    <div className="font-sans text-black leading-normal">
      {/* 1. Centered Logo & Title Block */}
      <div className="flex flex-col items-center text-center mb-6">
        <NancyReportLogoLockup />
        <div className="mt-4 leading-[1.35]">
          <div className="text-[15px] font-bold text-black">ACC Bioscience Incubator</div>
          <div className="text-[15px] font-bold text-black">Member Company Pitch Feedback Summary</div>
        </div>
      </div>

      {/* 2. Introductory Paragraphs (Exact Wording from Authority PDF) */}
      <div className="space-y-4 text-[14.5px] leading-[1.42] text-black mb-5">
        <p>
          Thank you for your pitch for membership at the ACC Bioscience Incubator (ABI). As part of the pitch process we
          want to provide you with the feedback from the committee on the pitch, your company, and the fit with ABI.
        </p>
        <p>
          We synthesized the feedback from all steering committee members and have summarized it below for your
          reference. While none of this is binding, please consider this feedback and use it to help your company grow
          and develop into its next stage. The contact information of all your committee members is provided below as
          well if you would like to reach out to them. Please let ABI staff know if you have any questions or would like
          further clarification.
        </p>
        <p>Thank you!</p>
      </div>

      {/* 3. Company Name, Steering Committee, and Pitch Date Fields */}
      <div className="flex items-baseline gap-1.5 text-[14.5px] leading-[1.4] text-black mb-5">
        <span className="font-bold uppercase shrink-0">COMPANY NAME:</span>
        <span className="flex-1 border-b-[1.5px] border-black font-bold pl-12 pb-[1px]">
          {companyNameDisplay}
        </span>
      </div>

      <div className="mb-7 text-[14.5px] text-black">
        <div className="font-bold uppercase mb-3">STEERING COMMITTEE:</div>
        <div className="pl-2.5 space-y-0.5 leading-[1.22]">
          {submittedReviewers.length > 0 ? (
            submittedReviewers.map((rev) => <div key={rev.id}>{rev.name}</div>)
          ) : (
            <div className="italic text-neutral-600">No submitted scorecards recorded for this meeting.</div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 text-[14.5px] leading-[1.4] text-black mb-7">
        <span className="font-bold uppercase shrink-0">PITCH DATE:</span>
        <span className="flex-1 border-b-[1.5px] border-black font-bold pl-16 pb-[1px]">
          {pitchDateDisplay}
        </span>
      </div>

      {/* 4. Five Standardized Sections (OVERALL FEEDBACK, TEAM, VALUE PROPOSITION, ABI FIT, RISK) */}
      <div>
        {sections.map((section, secIdx) => {
          const heading = formatReportSectionHeading(section);
          const resolvedQuotes = resolveSectionQuoteRefs(section, submittedReviewers);
          const showQuotesBlock = section.id !== 'overall' || resolvedQuotes.length > 0;

          return (
            <section key={section.id} className="text-black">
              {secIdx > 0 && <hr className="border-t border-neutral-500 mt-8 mb-4" />}

              <h3 className="text-[18px] font-bold uppercase text-black tracking-normal leading-tight">
                {heading}
              </h3>

              <p className="mt-3.5 text-[14.5px] leading-[1.45] text-black whitespace-pre-line">
                <span className="font-bold">Summary: </span>
                {section.summary || 'No summary text provided for this section.'}
              </p>

              {showQuotesBlock && (
                <div className="mt-6">
                  <div className="text-[14.5px] font-bold text-black mb-2.5">
                    Select Quotes from Committee:
                  </div>
                  {resolvedQuotes.length > 0 && (
                    <ul className="list-disc pl-9 space-y-3.5 text-[14.5px] leading-[1.42] text-black">
                      {resolvedQuotes.map((quoteItem, qIdx) => {
                        const cleaned = quoteItem.quote.trim().replace(/^["“”]+|["“”]+$/g, '');
                        return (
                          <li key={quoteItem.id || qIdx} className="pl-1">
                            &ldquo;{cleaned}&rdquo;
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full pt-6 sm:pt-8 pb-24 bg-canvas min-h-screen print:min-h-0 print:py-0 print:bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 print:max-w-none print:px-0 flex flex-col gap-8">
        {/* ===================================================================== */}
        {/* TOP CONTROL & STATUS BAR (Vertically Stacked, Hidden in Print)        */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-7 relative overflow-hidden print:hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Feedback Summary
            </h1>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 flex-wrap text-xs sm:text-sm text-slate-600 font-semibold">
                <span>
                  Applicant: <strong className="text-slate-900">{company.name}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Meeting: <strong className="text-slate-900">{activeMeeting?.title || 'Initial Pitch'}</strong>
                </span>
                {isDirty && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Unsaved Edits in Draft
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Editable 5-section committee feedback report for the selected meeting, shared across the on-screen view and PDF export.
              </p>
            </div>

            {/* Action Controls (Bottom Row, Wrapping Enabled) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleTriggerDemoGeneration}
                disabled={isGenerating}
                className="min-h-[42px] px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border border-slate-300"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{isGenerating ? 'Generating...' : 'Generate Demo Draft'}</span>
              </button>

              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveEdits}
                  className="min-h-[42px] px-5 py-2 rounded-2xl bg-accent hover:bg-accent-hover text-slate-950 font-extrabold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Draft</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="min-h-[42px] px-4 py-2 rounded-2xl border-2 border-slate-300 hover:border-primary bg-white text-slate-800 hover:text-primary font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>Edit Draft</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenPdfPreview}
                className="min-h-[42px] px-4 py-2 rounded-2xl border-2 border-primary bg-primary-light/60 hover:bg-primary-light text-primary font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-primary" />
                <span>Preview PDF</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPDF}
                className="min-h-[42px] px-5 py-2 rounded-2xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-accent" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* OVERWRITE CONFIRMATION MODAL (<dialog>)                               */}
        {/* ===================================================================== */}
        {isOverwriteModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="overwrite-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs print:hidden"
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-slate-200 space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h2 id="overwrite-modal-title" className="text-lg font-bold text-slate-900">
                  Replace Existing Draft?
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You have active or custom edits in the Feedback Summary for &ldquo;{activeMeeting?.title}&rdquo;. Generating a new synthesized draft will overwrite your existing text.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOverwriteModalOpen(false);
                    setPendingGenerationAction(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                >
                  Keep My Edits
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOverwriteModalOpen(false);
                    if (pendingGenerationAction) {
                      pendingGenerationAction();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-sm cursor-pointer"
                >
                  Confirm &amp; Replace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SCREEN-ONLY DRAFT EDITOR (Only shown while actively editing)          */}
        {/* ===================================================================== */}
        {isEditing && (
          <section className="bg-white border-2 border-primary/30 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Edit Report Content</h2>
                <p className="text-xs text-slate-500">
                  Changes update the 1:1 Member Company Pitch Feedback Summary report below and in PDF export.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveEdits}
                className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Done Editing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyNameDisplay}
                  onChange={(e) => {
                    setIsDirty(true);
                    setCompanyNameDisplay(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Pitch Date
                </label>
                <input
                  type="text"
                  value={pitchDateDisplay}
                  onChange={(e) => {
                    setIsDirty(true);
                    setPitchDateDisplay(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-6">
              {sections.map((section) => {
                const heading = formatReportSectionHeading(section);
                const resolvedQuotes = resolveSectionQuoteRefs(section, submittedReviewers);

                return (
                  <div key={section.id} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60 space-y-4">
                    <h3 className="text-base font-black text-slate-900 uppercase">{heading}</h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Summary
                      </label>
                      <textarea
                        value={section.summary}
                        onChange={(e) => handleSummaryChange(section.id, e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 leading-relaxed"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <label className="text-xs font-bold text-slate-600 uppercase">
                          Select Quotes from Committee
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddQuote(section.id)}
                          className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Quote</span>
                        </button>
                      </div>

                      {resolvedQuotes.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No quotes selected for this section.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {resolvedQuotes.map((quoteItem, qIdx) => (
                            <div key={quoteItem.id || qIdx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                              <div className="flex items-start gap-2">
                                <input
                                  type="text"
                                  value={quoteItem.quote}
                                  onChange={(e) => handleQuoteChange(section.id, qIdx, e.target.value)}
                                  className="flex-1 p-2 rounded-lg border border-slate-300 text-xs font-sans text-slate-900"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQuote(section.id, qIdx)}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Remove Quote"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-700">{quoteItem.reviewerName}</span>
                                {quoteItem.verificationStatus === 'verified' ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    <ShieldCheck className="w-3 h-3" />
                                    Source Verified
                                  </span>
                                ) : quoteItem.verificationStatus === 'edited' ? (
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    User Edited
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    Unverified Reference
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* MAIN REPORT DOCUMENT (1:1 Match with Nancy's Authority PDF)           */}
        {/* ===================================================================== */}
        <article className="w-full max-w-[816px] mx-auto bg-white border border-slate-200/90 shadow-md px-6 sm:px-14 md:px-16 py-10 sm:py-14 print:max-w-none print:border-0 print:shadow-none print:p-0">
          {renderNancyReportDocument()}
        </article>

        {/* ===================================================================== */}
        {/* PDF PREVIEW MODAL (Uses Exact Same Report Template & Saved Content)   */}
        {/* ===================================================================== */}
        {isPdfPreviewOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-preview-modal-title"
            className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-md print:hidden"
          >
            <div className="min-h-16 py-2.5 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-accent shrink-0" />
                <span id="pdf-preview-modal-title" className="font-bold text-xs sm:text-sm">
                  PDF Preview: {companyNameDisplay} Pitch Feedback Summary ({pitchDateDisplay})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPdfZoom((z) => Math.max(75, z - 10))}
                    className="p-1 text-slate-300 hover:text-white cursor-pointer"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono px-1.5 text-slate-200">{pdfZoom}%</span>
                  <button
                    type="button"
                    onClick={() => setPdfZoom((z) => Math.min(130, z + 10))}
                    className="p-1 text-slate-300 hover:text-white cursor-pointer"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePrintPDF}
                  className="px-4 py-1.5 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Export
                </button>
                <button
                  type="button"
                  onClick={() => setIsPdfPreviewOpen(false)}
                  className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close PDF Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              data-testid="pdf-preview-scroll-container"
              className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 bg-slate-900/50"
            >
              <div
                data-testid="pdf-preview-document"
                style={{ width: `${Math.round((816 * pdfZoom) / 100)}px` }}
                className="mx-auto h-fit max-w-full bg-white text-black px-6 sm:px-14 md:px-16 py-10 sm:py-14 shadow-2xl"
              >
                {renderNancyReportDocument()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
