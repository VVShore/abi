import React, { useState, useMemo } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  getSubmittedReviewers,
  calculateCommitteeCategoryAverages,
  extractEvaluatorPills,
  deriveIndividualLowScoreConcerns,
  computeReviewerCategoryAverage,
  ReviewerPillData,
} from '../utils/scoringCalculations';
import {
  resolveSectionQuoteRefs,
  extractSourceQuotesForCategory,
} from '../utils/quoteProvenance';
import {
  ChevronUp,
  ChevronDown,
  Printer,
  Mail,
  Sparkles,
  Users,
  TrendingUp,
  FlaskConical,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface CategoryDistributionCard {
  id: string;
  title: string;
  average: number;
  badgeText?: string;
  badgeType?: 'highest' | 'risk';
  evaluators: ReviewerPillData[];
}

export const PitchFeedbackReportView: React.FC = () => {
  const { company, activeMeeting, reviewers, setIsEmailModalOpen, activeMeetingFeedback } = useEvaluation();

  // Filter submitted reviewers for this meeting
  const submittedReviewers = useMemo(() => {
    return getSubmittedReviewers(activeMeeting);
  }, [activeMeeting]);

  // Dynamic Category Averages and Distribution
  const categoryMetrics = useMemo(() => {
    return calculateCommitteeCategoryAverages(submittedReviewers);
  }, [submittedReviewers]);

  // Section 1 state: show/hide evaluator pills or full matrix
  const [showDistributionPills, setShowDistributionPills] = useState(true);

  // Section 2 state: consensus theme quotes collapsed by default
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({});

  // Section 3 state: areas to address accordions
  const [expandedGapTopics, setExpandedGapTopics] = useState<Record<string, boolean>>({});

  // Section 4 state: Multi-select topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'coachability',
    'pmf',
    'lab',
    'risk',
  ]);

  // 1. Dynamic Category Averages & Reviewer Spread Distribution Data
  const categoryCards: CategoryDistributionCard[] = useMemo(() => {
    return [
      {
        id: 'team',
        title: 'TEAM COMPETENCY',
        average: categoryMetrics.team.average,
        badgeText: categoryMetrics.team.badgeText,
        badgeType: categoryMetrics.team.badgeType,
        evaluators: extractEvaluatorPills(submittedReviewers, 'team'),
      },
      {
        id: 'value_prop',
        title: 'VALUE PROPOSITION',
        average: categoryMetrics.market.average,
        badgeText: categoryMetrics.market.badgeText,
        badgeType: categoryMetrics.market.badgeType,
        evaluators: extractEvaluatorPills(submittedReviewers, 'market'),
      },
      {
        id: 'abi_fit',
        title: 'ABI FIT & EQUIPMENT',
        average: categoryMetrics.fit.average,
        badgeText: categoryMetrics.fit.badgeText,
        badgeType: categoryMetrics.fit.badgeType,
        evaluators: extractEvaluatorPills(submittedReviewers, 'fit'),
      },
      {
        id: 'risk',
        title: 'RISK & COMMERCIAL',
        average: categoryMetrics.risk.average,
        badgeText: categoryMetrics.risk.badgeText,
        badgeType: categoryMetrics.risk.badgeType,
        evaluators: extractEvaluatorPills(submittedReviewers, 'risk'),
      },
    ];
  }, [categoryMetrics, submittedReviewers]);

  // 2. Dynamic Consensus Themes derived from Nancy's Feedback Sections
  const consensusThemes = useMemo(() => {
    return activeMeetingFeedback
      .filter((sec) => sec.id !== 'overall')
      .map((sec) => {
        const resolvedRefs = resolveSectionQuoteRefs(sec, submittedReviewers);
        const quotes = resolvedRefs.map((qr) => ({
          quote: qr.quote,
          author: qr.reviewerName,
          role: qr.reviewerRole,
          verificationStatus: qr.verificationStatus,
        }));

        const isRisk = sec.id === 'risk';
        return {
          id: `theme_${sec.id}`,
          reviewerLabel: `${submittedReviewers.length} reviewer${submittedReviewers.length === 1 ? '' : 's'}`,
          sentiment: isRisk ? ('concern' as const) : ('positive' as const),
          title: sec.title.replace(/^FEEDBACK ON\s+/i, ''),
          summary: sec.summary || `Synthesized feedback for ${sec.title.toLowerCase()}.`,
          quotes,
        };
      });
  }, [activeMeetingFeedback, submittedReviewers]);

  // 3. Low-Score Concerns (Directly derived from ratings of 1 or 2)
  const lowScoreConcerns = useMemo(() => {
    return deriveIndividualLowScoreConcerns(submittedReviewers);
  }, [submittedReviewers]);

  // Group low score concerns by category
  const groupedGaps = useMemo(() => {
    const map = new Map<string, typeof lowScoreConcerns>();
    lowScoreConcerns.forEach((concern) => {
      const list = map.get(concern.categoryLabel) || [];
      list.push(concern);
      map.set(concern.categoryLabel, list);
    });
    return Array.from(map.entries()).map(([label, items]) => ({
      id: `gap_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
      title: label,
      summary: `Reviewers identified ${items.length} critical concern${items.length === 1 ? '' : 's'} with individual scores of 1 or 2.`,
      items,
    }));
  }, [lowScoreConcerns]);

  // 4. Reviewer Comments by Topic derived from submitted scorecards
  const topicGroups = useMemo(() => {
    const buildComments = (prefix: 'team' | 'market' | 'fit' | 'risk') => {
      const extracted = extractSourceQuotesForCategory(submittedReviewers, prefix);
      if (extracted.length > 0) {
        return extracted.map((qr) => ({
          initials: qr.reviewerInitials || qr.reviewerName.slice(0, 2).toUpperCase(),
          name: qr.reviewerName,
          score: qr.score ?? 0,
          quote: qr.quote,
        }));
      }

      // Fallback for submitted scorecards that only recorded keyStrengths or supportNeeded
      return submittedReviewers
        .map((r) => {
          const fallbackQuote =
            prefix === 'risk'
              ? r.supportNeeded
              : prefix === 'team'
              ? r.keyStrengths
              : undefined;
          const score = computeReviewerCategoryAverage(r, prefix);
          return {
            initials: r.initials,
            name: r.name,
            score,
            quote: fallbackQuote || '',
          };
        })
        .filter((c) => Boolean(c.quote && c.quote.trim().length > 10));
    };

    return [
      {
        id: 'coachability',
        label: 'Coachability & Team',
        uppercaseTitle: 'COACHABILITY & TEAM',
        icon: 'coachability' as const,
        comments: buildComments('team'),
      },
      {
        id: 'pmf',
        label: 'Value Proposition & Demand',
        uppercaseTitle: 'VALUE PROPOSITION & DEMAND',
        icon: 'pmf' as const,
        comments: buildComments('market'),
      },
      {
        id: 'lab',
        label: 'Lab Space & ABI Fit',
        uppercaseTitle: 'LAB SPACE & ABI FIT',
        icon: 'lab' as const,
        comments: buildComments('fit'),
      },
      {
        id: 'risk',
        label: 'Regulatory & Commercial Risk',
        uppercaseTitle: 'REGULATORY & COMMERCIAL RISK',
        icon: 'risk' as const,
        comments: buildComments('risk'),
      },
    ];
  }, [submittedReviewers]);

  const toggleThemeCard = (id: string) => {
    setExpandedThemes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGapTopic = (id: string) => {
    setExpandedGapTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTopicSelection = (topicId: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicId)) {
        if (prev.length === 1) return prev; // Keep at least one active
        return prev.filter((id) => id !== topicId);
      }
      return [...prev, topicId];
    });
  };

  const renderTopicIcon = (type: 'coachability' | 'pmf' | 'lab' | 'risk', isLight = false) => {
    const cls = `w-4 h-4 ${isLight ? 'text-white' : 'text-primary'}`;
    switch (type) {
      case 'coachability':
        return <Users className={cls} />;
      case 'pmf':
        return <TrendingUp className={cls} />;
      case 'lab':
        return <FlaskConical className={cls} />;
      case 'risk':
        return <ShieldAlert className={cls} />;
    }
  };

  return (
    <div className="w-full pt-6 sm:pt-8 pb-24 bg-canvas min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10">
        {/* ===================================================================== */}
        {/* PAGE HEADER BANNER                                                    */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="bg-primary text-white font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Scorecard Synthesizer
                </span>
                <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                  Applicant: <strong className="text-slate-900">{company.name}</strong> • Meeting: <strong className="text-slate-900">{activeMeeting?.title || 'Initial Pitch'}</strong>
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  {submittedReviewers.length} of {reviewers.length} Reviewers Submitted
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Committee Insights
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
                One central place for Nancy and steering committee members to review category score distributions,
                expandable consensus themes with verbatim quotes, flagged low-score gaps, and topic-filtered remarks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-slate-300 hover:border-primary bg-white text-slate-800 hover:text-primary font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print View</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span>Share Takeaways</span>
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* ZERO-STATE WARNING BANNER (When 0 scorecards submitted)               */}
        {/* ===================================================================== */}
        {submittedReviewers.length === 0 && (
          <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-start gap-4 text-amber-900">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-extrabold text-amber-900">
                No Submitted Scorecards for This Meeting
              </h2>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                Committee Insights are calculated exclusively from submitted evaluator scorecards. Reviewers currently have draft status in &ldquo;{activeMeeting?.title || 'Selected Meeting'}&rdquo;. Switch to the <strong>Individual Scorecard</strong> tab to complete and submit evaluations.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 1. CATEGORY AVERAGES & REVIEWER SPREAD DISTRIBUTION                   */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Category Averages &amp; Reviewer Spread Distribution
                </h2>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-primary-light text-primary border border-primary/20">
                  4 Core Dimensions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Computed directly from {submittedReviewers.length} submitted evaluator scorecard{submittedReviewers.length === 1 ? '' : 's'}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDistributionPills(!showDistributionPills)}
              className="self-start sm:self-center px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>{showDistributionPills ? 'Hide Full Matrix' : 'Show Full Matrix'}</span>
              {showDistributionPills ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>

          {/* 4-Column Category Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {categoryCards.map((card) => {
              const isRiskCard = card.badgeType === 'risk';
              const isHighestCard = card.badgeType === 'highest';

              return (
                <div
                  key={card.id}
                  className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                    isRiskCard
                      ? 'bg-status-warning-light border-2 border-amber-300/90 shadow-2xs'
                      : isHighestCard
                      ? 'bg-canvas border-2 border-accent/60 shadow-2xs'
                      : 'bg-canvas border border-slate-200/90'
                  }`}
                >
                  <div>
                    {/* Top Header & Optional Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        {card.title}
                      </span>
                      {card.badgeText && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isRiskCard
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {card.badgeText}
                        </span>
                      )}
                    </div>

                    {/* Large Average Score */}
                    <div className="flex items-baseline gap-1 my-2">
                      <span
                        className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                          isRiskCard
                            ? 'text-amber-600'
                            : isHighestCard
                            ? 'text-status-success-dark'
                            : 'text-slate-900'
                        }`}
                      >
                        {card.average.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">/ 5.0</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal">
                      {isRiskCard
                        ? 'Flagged risk due to lower average or individual low-score ratings.'
                        : isHighestCard
                        ? 'Highest evaluated dimension across committee scorecards.'
                        : 'Consensus score within standard incubation parameters.'}
                    </p>
                  </div>

                  {/* Evaluator Pills */}
                  {showDistributionPills && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Evaluators ({card.evaluators.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {card.evaluators.map((ev, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                              ev.isLow
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : ev.isHigh
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>{ev.score.toFixed(1)}</span>
                            <span className="font-sans font-normal text-slate-600 text-[11px]">
                              {ev.name}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. WHAT REVIEWERS NOTICED (CONSENSUS THEMES)                         */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              What Reviewers Noticed
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Consensus observations across Nancy&rsquo;s 5 standardized feedback sections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {consensusThemes.map((theme) => {
              const isExpanded = Boolean(expandedThemes[theme.id]);
              const isPositive = theme.sentiment === 'positive';

              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {theme.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                          isPositive
                            ? 'bg-status-success-light text-prototype-detail-3 border border-accent/30'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {theme.reviewerLabel}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                      {theme.summary}
                    </p>
                  </div>

                  <div className="mt-5">
                    {theme.quotes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleThemeCard(theme.id)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-2.5 -ml-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>
                          {isExpanded
                            ? 'Hide quotes'
                            : `View ${theme.quotes.length} reviewer quote${theme.quotes.length === 1 ? '' : 's'}`}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    )}

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        {theme.quotes.map((q, idx) => (
                          <blockquote key={idx} className="pl-3.5 border-l-2 border-slate-200 space-y-1">
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                              &ldquo;{q.quote}&rdquo;
                            </p>
                            <footer className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-800">{q.author}</span>
                              <span>·</span>
                              <span>{q.role}</span>
                              {q.verificationStatus === 'verified' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3" />
                                  Source Verified
                                </span>
                              ) : q.verificationStatus === 'edited' ? (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                                  User Edited
                                </span>
                              ) : (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                  Unverified Reference
                                </span>
                              )}
                            </footer>
                          </blockquote>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. AREAS TO ADDRESS (Derived from individual scores of 1 or 2)        */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Areas to Address
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Directly derived from individual submitted reviewer ratings of 1 or 2. Open each category to review specific evaluator concerns.
            </p>
          </div>

          {groupedGaps.length === 0 ? (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-semibold">
                No low-score concerns (individual ratings of 1 or 2) were flagged by submitted reviewers for this meeting.
              </p>
            </div>
          ) : (
            <div className="mt-7 space-y-4">
              {groupedGaps.map((group) => {
                const isExpanded = Boolean(expandedGapTopics[group.id]);
                const count = group.items.length;

                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 transition-colors hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {group.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {count === 1 ? '1 Flagged Concern' : `${count} Flagged Concerns`}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                      {group.summary}
                    </p>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => toggleGapTopic(group.id)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-2.5 -ml-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>
                          {isExpanded
                            ? 'Hide flagged feedback'
                            : `View ${count} flagged evaluator comment${count === 1 ? '' : 's'}`}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 divide-y divide-slate-100 space-y-3">
                        {group.items.map((item) => (
                          <div key={item.id} className="pt-3 first:pt-0">
                            <blockquote className="pl-3.5 border-l-2 border-amber-400 space-y-1.5">
                              <p className="text-sm text-slate-700 leading-relaxed italic">
                                &ldquo;{item.noteOrComment}&rdquo;
                              </p>
                              <footer className="text-xs flex flex-wrap items-center gap-2 text-slate-500">
                                <span className="font-bold text-slate-900">{item.reviewerName}</span>
                                <span>·</span>
                                <span className="font-mono font-bold text-amber-700">Rating: {item.score} of 5</span>
                                <span>·</span>
                                <span>{item.criterionTitle}</span>
                              </footer>
                            </blockquote>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 4. REVIEWER REMARKS BY TOPIC                                          */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
              Reviewer Comments by Topic
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Select one or more topics to filter verified remarks from submitted scorecards.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              {topicGroups.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopicSelection(topic.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {renderTopicIcon(topic.icon, isSelected)}
                    <span>{topic.label} ({topic.comments.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6 mt-6">
            {topicGroups
              .filter((t) => selectedTopics.includes(t.id))
              .map((topic) => (
                <div key={topic.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    {renderTopicIcon(topic.icon, false)}
                    <span>{topic.uppercaseTitle}</span>
                  </div>

                  {topic.comments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No comments submitted for this category.</p>
                  ) : (
                    <div className="space-y-3">
                      {topic.comments.map((c, idx) => (
                        <div
                          key={idx}
                          className="bg-canvas rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                              {c.initials}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-slate-900">{c.name}</div>
                              <p className="text-xs sm:text-sm italic text-slate-700 mt-1 leading-relaxed">
                                &ldquo;{c.quote}&rdquo;
                              </p>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-sm text-slate-700 shrink-0">
                            {c.score > 0 ? c.score.toFixed(1) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};
