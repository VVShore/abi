import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  ChevronUp,
  ChevronDown,
  AlertCircle,
  MessageSquareQuote,
  Printer,
  Mail,
  Filter,
  Sparkles,
  CheckCircle2,
  Users,
  TrendingUp,
  FlaskConical,
  ShieldAlert,
} from 'lucide-react';

interface EvaluatorPill {
  score: number;
  name: string;
  isLow?: boolean;
  isHigh?: boolean;
}

interface CategoryDistributionCard {
  id: string;
  title: string;
  average: number;
  badgeText?: string;
  badgeType?: 'highest' | 'risk';
  evaluators: EvaluatorPill[];
}

interface VerbatimQuote {
  quote: string;
  author: string;
  role: string;
}

interface ConsensusTheme {
  id: string;
  categoryTag: string;
  alignmentBadge: string;
  title: string;
  summary: string;
  quotes: VerbatimQuote[];
}

interface GapItem {
  id: string;
  reviewer: string;
  score: number;
  quote: string;
  category: 'Team Competency' | 'Risk & Commercial';
  subCriterion: string;
}

interface TopicComment {
  initials: string;
  name: string;
  score: number;
  quote: string;
}

interface TopicGroup {
  id: string;
  label: string;
  uppercaseTitle: string;
  icon: 'coachability' | 'pmf' | 'lab' | 'risk';
  comments: TopicComment[];
}

export const PitchFeedbackReportView: React.FC = () => {
  const { company, setIsEmailModalOpen } = useEvaluation();

  // Section 1 state: show/hide evaluator pills or full matrix
  const [showDistributionPills, setShowDistributionPills] = useState(true);

  // Section 2 state: expanded theme cards (first 2 expanded by default to match PDF screenshot)
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({
    theme_coachable: true,
    theme_facility: true,
    theme_hardware: false,
    theme_staffing: false,
  });

  // Section 3 state: Filter Category for Identified Gaps
  const [gapCategoryFilter, setGapCategoryFilter] = useState<string>('ALL');

  // Section 4 state: Multi-select topics (all 4 selected by default as in Page 4 screenshot)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'coachability',
    'pmf',
    'lab',
    'risk',
  ]);

  // 1. Category Averages & Reviewer Spread Distribution Data (Page 1 of PDF)
  const categoryCards: CategoryDistributionCard[] = [
    {
      id: 'team',
      title: 'TEAM COMPETENCY',
      average: 3.6,
      evaluators: [
        { score: 4, name: 'Lyon' },
        { score: 4, name: 'Allen' },
        { score: 4, name: 'Overstreet' },
        { score: 3.3, name: 'Lieberman' },
        { score: 3.3, name: 'Smith' },
        { score: 2.7, name: 'Marklund' },
      ],
    },
    {
      id: 'value_prop',
      title: 'VALUE PROPOSITION',
      average: 3.9,
      evaluators: [
        { score: 4, name: 'Lyon' },
        { score: 4.3, name: 'Allen' },
        { score: 4, name: 'Overstreet' },
        { score: 4, name: 'Lieberman' },
        { score: 3.7, name: 'Smith' },
        { score: 3.3, name: 'Marklund' },
      ],
    },
    {
      id: 'abi_fit',
      title: 'ABI FIT & EQUIPMENT',
      average: 4.0,
      badgeText: 'Highest',
      badgeType: 'highest',
      evaluators: [
        { score: 4.3, name: 'Lyon', isHigh: true },
        { score: 4, name: 'Allen' },
        { score: 4, name: 'Overstreet' },
        { score: 4, name: 'Lieberman' },
        { score: 3, name: 'Smith' },
        { score: 4.7, name: 'Marklund', isHigh: true },
      ],
    },
    {
      id: 'risk',
      title: 'RISK & COMMERCIAL',
      average: 2.8,
      badgeText: 'Flagged Risk',
      badgeType: 'risk',
      evaluators: [
        { score: 3, name: 'Lyon' },
        { score: 3, name: 'Allen' },
        { score: 2.3, name: 'Overstreet', isLow: true },
        { score: 4, name: 'Lieberman', isHigh: true },
        { score: 2, name: 'Smith', isLow: true },
        { score: 2.3, name: 'Marklund', isLow: true },
      ],
    },
  ];

  // 2. Consensus Themes & Full Verbatim Key Takeaways Data (Page 2 of PDF)
  const consensusThemes: ConsensusTheme[] = [
    {
      id: 'theme_coachable',
      categoryTag: 'FOUNDER DEMEANOR',
      alignmentBadge: '3 Reviewers Strongly Aligned',
      title: 'Receptive to Training & Coachable',
      summary:
        'Universal observation that Dr. Marcel demonstrates humility, acknowledges technical knowledge gaps, and actively invites committee guidance.',
      quotes: [
        {
          quote:
            'Phil has communicated very openly his need for training/education in microbiology... during the pitch they were very receptive.',
          author: 'Nancy Lyon',
          role: 'Lead Facilitator',
        },
        {
          quote:
            "Appeared super open to comment and direction. Very open about what they know and don't know.",
          author: 'Shane Allen',
          role: 'Commercial Reviewer',
        },
        {
          quote:
            'Seemed open to feedback, and admitted that some of the science was unsettled.',
          author: 'Kevin Smith',
          role: 'IP Specialist',
        },
      ],
    },
    {
      id: 'theme_facility',
      categoryTag: 'FACILITY ALIGNMENT',
      alignmentBadge: 'All 6 Evaluators Agreed',
      title: 'Exact Fit for ABI Equipment & Facilities',
      summary:
        "Neoneuron's scientific protocols directly leverage ACC Highland's core assets (BSL-2 cell culture, analytical flow cytometry, -80°C biobanking) without requiring any capital retrofits.",
      quotes: [
        {
          quote:
            'Yes... cell culture, flow cytometry, freezers. Exactly what we support at ACC Highland.',
          author: 'Nancy Lyon & Shane Allen',
          role: 'Review Committee',
        },
        {
          quote:
            'BSL-2 wet bench and flow cytometer are an exact match for our Highland facility. Day 1 operational readiness.',
          author: 'Jesper Marklund',
          role: 'Wet Lab Evaluator',
        },
        {
          quote:
            'ACC Highland equipment is ready to deploy immediately. No plumbing or HVAC changes needed.',
          author: 'Jeremy Lieberman',
          role: 'Bioscience Strategy',
        },
      ],
    },
    {
      id: 'theme_hardware',
      categoryTag: 'VALUE PROPOSITION NOVELTY',
      alignmentBadge: '4 of 6 Evaluators Highlighted',
      title: 'Hardware Delivery Device is Core Commercial Driver',
      summary:
        'The committee distinctly separated the physical micro-delivery injection device as the high-value defensible asset, noting it has clearer commercial differentiation than early cellular lines.',
      quotes: [
        {
          quote:
            'The major value add for their tech is the surgical implantation, which is far above competitors. Specific cell enrichment is slightly better, but less separation it seems.',
          author: 'Shane Allen',
          role: 'Commercial Reviewer',
        },
        {
          quote:
            'The specific injection technology may have more monetary value than the cellular component at the end of the day, and further development can de-risk the less mature therapeutic component.',
          author: 'Jeremy Lieberman',
          role: 'Bioscience Strategy',
        },
        {
          quote:
            "It feels like they've figured out a potentially better hardware delivery solution to a problem that people want solved.",
          author: 'Erin Overstreet',
          role: 'Clinical Reviewer',
        },
        {
          quote:
            'It [the delivery technology] is well defined and provides an independent licensing path.',
          author: 'Nancy Lyon',
          role: 'Lead Facilitator',
        },
      ],
    },
    {
      id: 'theme_staffing',
      categoryTag: 'PERSONNEL VULNERABILITY',
      alignmentBadge: '4 of 6 Evaluators Noted',
      title: 'Lab Staffing & Solo Founder Bottleneck',
      summary:
        'Praise for scientific acumen was counterbalanced by unanimous concern that a solo founder cannot simultaneously run wet lab experiments, maintain biohazard protocols, and raise institutional capital.',
      quotes: [
        {
          quote:
            'He will need lab staff and some business help. He acknowledged the lab need.',
          author: 'Nancy Lyon',
          role: 'Lead Facilitator',
        },
        {
          quote:
            'This technology is far from validation. He would need to hire dedicated lab staff immediately; Marcel cannot operate wet lab equipment alone.',
          author: 'Jesper Marklund',
          role: 'Wet Lab Evaluator',
        },
        {
          quote:
            'They will need to hire staff to conduct the work at the incubator and ensure those staff work well in these spaces.',
          author: 'Shane Allen',
          role: 'Commercial Reviewer',
        },
        {
          quote:
            'Two largest gaps identified: selection of appropriate laboratory staff to conduct the work and advisors for non-technical business development.',
          author: 'Kevin Smith',
          role: 'IP Specialist',
        },
      ],
    },
  ];

  // 3. Identified Gaps & Low Scores (Rating 1 or 2 Verbatim Quotes) Data (Page 3 of PDF)
  const gapItems: GapItem[] = [
    {
      id: 'gap_1',
      reviewer: 'Jesper Marklund',
      score: 2,
      quote:
        "This technology is far from validation. An investor would hesitate. He'd need to hire dedicated lab staff immediately; Marcel cannot operate wet lab equipment alone.",
      category: 'Team Competency',
      subCriterion: 'Operational Execution & Staffing',
    },
    {
      id: 'gap_2',
      reviewer: 'Erin Overstreet',
      score: 2,
      quote:
        'Unclear regulatory clearance pathway. No iPS-derived cell technology like this has made it through FDA review yet. Two potentially diverging customers: cells vs device.',
      category: 'Risk & Commercial',
      subCriterion: 'FDA Regulatory Classification',
    },
    {
      id: 'gap_3',
      reviewer: 'Kevin Smith',
      score: 2,
      quote:
        'Regulatory strategy is essentially absent; assumes simple 510(k) without factoring biological delivery.',
      category: 'Risk & Commercial',
      subCriterion: 'FDA Regulatory Classification',
    },
    {
      id: 'gap_4',
      reviewer: 'Jesper Marklund',
      score: 2,
      quote:
        'Device vs drug regulatory boundary must be settled with FDA advisors.',
      category: 'Risk & Commercial',
      subCriterion: 'FDA Regulatory Classification',
    },
    {
      id: 'gap_5',
      reviewer: 'Erin Overstreet',
      score: 2,
      quote:
        'Ambiguity on whether legacy patents cover combination delivery mechanisms.',
      category: 'Risk & Commercial',
      subCriterion: 'IP & Patent Freedom to Operate',
    },
    {
      id: 'gap_6',
      reviewer: 'Kevin Smith',
      score: 2,
      quote:
        'Far from commercial readiness. Patent portfolio status is vague and several foundational patents may already be expired. Freedom to operate is untested.',
      category: 'Risk & Commercial',
      subCriterion: 'IP & Patent Freedom to Operate',
    },
    {
      id: 'gap_7',
      reviewer: 'Jesper Marklund',
      score: 2,
      quote:
        'Prior art in micro-infusion delivery is dense; FTO opinion is mandatory.',
      category: 'Risk & Commercial',
      subCriterion: 'IP & Patent Freedom to Operate',
    },
    {
      id: 'gap_8',
      reviewer: 'Kevin Smith',
      score: 2,
      quote: 'Very vulnerable without closed equity co-investors.',
      category: 'Risk & Commercial',
      subCriterion: 'Runway & Commercialization',
    },
  ];

  // 4. Reviewer Comments by Topic Data (Page 4 of PDF)
  const topicGroups: TopicGroup[] = [
    {
      id: 'coachability',
      label: 'Coachability & Leadership',
      uppercaseTitle: 'COACHABILITY & LEADERSHIP',
      icon: 'coachability',
      comments: [
        {
          initials: 'SA',
          name: 'Shane Allen',
          score: 4.0,
          quote:
            'Strong executive baseline. The CEO immediately recognized gaps in their reimbursement assumptions.',
        },
        {
          initials: 'KS',
          name: 'Kevin Smith',
          score: 5.0,
          quote:
            'Founders showed great poise under pressure during technical cross-examination.',
        },
      ],
    },
    {
      id: 'pmf',
      label: 'Product-Market Fit & Demand',
      uppercaseTitle: 'PRODUCT-MARKET FIT & DEMAND',
      icon: 'pmf',
      comments: [
        {
          initials: 'NP',
          name: 'Nancy Patterson',
          score: 3.5,
          quote:
            'Mechanistic plausibility is there, but not yet clinical proof.',
        },
      ],
    },
    {
      id: 'lab',
      label: 'Lab Space & Equipment Fit',
      uppercaseTitle: 'LAB SPACE & EQUIPMENT FIT',
      icon: 'lab',
      comments: [
        {
          initials: 'SA',
          name: 'Shane Allen',
          score: 3.8,
          quote:
            "They don't need sophisticated instrumentation, though Impact Lab would help.",
        },
      ],
    },
    {
      id: 'risk',
      label: 'Regulatory & Reimbursement Risk',
      uppercaseTitle: 'REGULATORY & REIMBURSEMENT RISK',
      icon: 'risk',
      comments: [
        {
          initials: 'SA',
          name: 'Shane Allen',
          score: 4.2,
          quote:
            'Adjunctive procedures are vulnerable for reimbursement; payers can deny or bundle add-ons.',
        },
      ],
    },
  ];

  const toggleThemeCard = (id: string) => {
    setExpandedThemes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAllQuotes = () => {
    const allExpanded = consensusThemes.every((t) => expandedThemes[t.id]);
    const nextState: Record<string, boolean> = {};
    consensusThemes.forEach((t) => {
      nextState[t.id] = !allExpanded;
    });
    setExpandedThemes(nextState);
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

  const filteredGaps =
    gapCategoryFilter === 'ALL'
      ? gapItems
      : gapItems.filter((g) => g.category === gapCategoryFilter);

  const renderTopicIcon = (type: TopicGroup['icon'], isLight = false) => {
    const cls = `w-4 h-4 ${isLight ? 'text-white' : 'text-[#431A4D]'}`;
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
    <div className="w-full pt-6 sm:pt-8 pb-24 bg-[#F8FAFD] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10">
        {/* ===================================================================== */}
        {/* PAGE HEADER BANNER (Webpage Theme)                                    */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#431A4D] via-[#78BE20] to-[#431A4D]" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="bg-[#431A4D] text-white font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#78BE20]" />
                  Scorecard Synthesizer
                </span>
                <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                  Applicant: <strong className="text-slate-900">{company.name}</strong> • Reviewed {company.reviewDate}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Committee Highlights and Key Takeaways
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
                className="min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-slate-300 hover:border-[#431A4D] bg-white text-slate-800 hover:text-[#431A4D] font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print View</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#431A4D] hover:bg-[#34143D] text-white font-extrabold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#78BE20]" />
                <span>Share Takeaways</span>
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 1. CATEGORY AVERAGES & REVIEWER SPREAD DISTRIBUTION (Page 1 of PDF)   */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Category Averages &amp; Reviewer Spread Distribution
                </h2>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#F3EBFA] text-[#431A4D] border border-[#431A4D]/20">
                  4 Core Dimensions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Computed directly from verified evaluator rubric inputs. Reviewer score pills show individual grading distributions.
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
                      ? 'bg-[#FFFDF7] border-2 border-amber-300/90 shadow-2xs'
                      : isHighestCard
                      ? 'bg-[#F8FAFD] border-2 border-[#78BE20]/60 shadow-2xs'
                      : 'bg-[#F8FAFD] border border-slate-200/90'
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
                            ? 'text-[#008A2E]'
                            : 'text-slate-900'
                        }`}
                      >
                        {card.average % 1 === 0 ? card.average.toFixed(0) : card.average.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">/ 5.0</span>
                    </div>
                  </div>

                  {/* Individual Evaluator Score Pills */}
                  {showDistributionPills && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                        INDIVIDUAL EVALUATORS
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {card.evaluators.map((ev, idx) => (
                          <span
                            key={idx}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border font-mono ${
                              ev.isLow
                                ? 'bg-amber-50 text-amber-900 border-amber-300 font-extrabold'
                                : ev.isHigh
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                : 'bg-white text-slate-700 border-slate-200/90'
                            }`}
                          >
                            {ev.score} - {ev.name}
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
        {/* 2. CONSENSUS THEMES & FULL VERBATIM KEY TAKEAWAYS (Page 2 of PDF)     */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-7 h-7 rounded-lg bg-[#F2F9EC] text-[#008A2E] border border-[#78BE20]/40 flex items-center justify-center font-black text-sm">
                  <MessageSquareQuote className="w-4 h-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Consensus Themes &amp; Full Verbatim Key Takeaways
                </h2>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#F2F9EC] text-[#006100] border border-[#78BE20]/40">
                  Bordered in ABI Green
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Clustered qualitative takeaways. Click any theme card to expand and review the exact, unedited verbatim quotes with evaluator names attached.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAllQuotes}
              className="self-start sm:self-center px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shrink-0"
            >
              Toggle All Quotes
            </button>
          </div>

          {/* 2x2 Grid of Expandable Theme Cards Bordered in ABI Green */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 items-start">
            {consensusThemes.map((theme) => {
              const isExpanded = Boolean(expandedThemes[theme.id]);

              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl border-2 border-[#78BE20] shadow-xs overflow-hidden transition-all"
                >
                  {/* Theme Card Header & Summary */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        {theme.categoryTag}
                      </span>
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#F2F9EC] text-[#006100] border border-[#78BE20]/40">
                        {theme.alignmentBadge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {theme.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {theme.summary}
                    </p>
                  </div>

                  {/* Expand / Collapse Bar */}
                  <button
                    type="button"
                    onClick={() => toggleThemeCard(theme.id)}
                    className="w-full px-5 sm:px-6 py-3 bg-[#F8FAFD] hover:bg-[#F2F9EC]/60 border-t border-slate-200/80 flex items-center justify-between text-xs font-extrabold text-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#78BE20] font-serif text-base leading-none">&ldquo;&rdquo;</span>
                      <span>
                        {isExpanded ? 'Hide Full Verbatim Quotes' : 'Expand Exact Verbatim Quotes'}
                      </span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {/* Expanded Verbatim Quotes List */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 pt-3 bg-[#F8FAFD]/60 border-t border-slate-100 space-y-3">
                      {theme.quotes.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-white rounded-xl p-4 border-l-4 border-l-[#78BE20] border border-slate-200/80 shadow-2xs"
                        >
                          <p className="text-xs sm:text-sm italic text-slate-800 leading-relaxed">
                            &ldquo;{q.quote}&rdquo;
                          </p>
                          <div className="mt-2.5 flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-900">
                              — {q.author}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {q.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. IDENTIFIED GAPS & LOW SCORES (Rating 1 or 2 Verbatim Quotes)       */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-[#333333] rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Identified Gaps &amp; Low Scores (Rating 1 or 2 Verbatim Quotes)
                </h2>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#333333] text-white">
                  Bordered in #333333
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Automatically filtered entries where an evaluator assigned a 1 or 2 score. These items form the mandatory contractual milestones for conditional entry.
              </p>
            </div>

            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <label
                htmlFor="gap-category-filter"
                className="text-xs font-bold text-slate-500 flex items-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Category:</span>
              </label>
              <select
                id="gap-category-filter"
                value={gapCategoryFilter}
                onChange={(e) => setGapCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#431A4D] cursor-pointer"
              >
                <option value="ALL">All Gaps ({gapItems.length})</option>
                <option value="Team Competency">
                  Team Competency ({gapItems.filter((g) => g.category === 'Team Competency').length})
                </option>
                <option value="Risk & Commercial">
                  Risk &amp; Commercial ({gapItems.filter((g) => g.category === 'Risk & Commercial').length})
                </option>
              </select>
            </div>
          </div>

          {/* 3-Column Grid of Low Score Gap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredGaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  {/* Reviewer Name & Red Score Badge */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <span className="font-extrabold text-sm text-slate-900">
                      {gap.reviewer}
                    </span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                      Score: {gap.score}
                    </span>
                  </div>

                  {/* Verbatim Quote */}
                  <div className="my-4 pl-3 border-l-2 border-slate-300">
                    <p className="text-xs sm:text-[13px] italic text-slate-700 leading-relaxed">
                      &ldquo;{gap.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Footer: Category & Sub-Criterion */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-slate-600">{gap.category}</span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[180px]">
                    {gap.subCriterion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4. REVIEWER COMMENTS BY TOPIC (Page 4 of PDF)                         */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-[#141b2b] tracking-tight uppercase">
              Reviewer Comments by Topic
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Select one or more topics to see individual reviewer remarks.
            </p>

            {/* Topic Pill Buttons (Multi-select) */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              {topicGroups.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopicSelection(topic.id)}
                    className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6B3FA0] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {renderTopicIcon(topic.icon, isSelected)}
                    <span>{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Topic Comment Sections */}
          <div className="space-y-6 mt-6">
            {topicGroups
              .filter((t) => selectedTopics.includes(t.id))
              .map((topic) => (
                <div key={topic.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#141b2b]">
                    {renderTopicIcon(topic.icon, false)}
                    <span>{topic.uppercaseTitle}</span>
                  </div>

                  <div className="space-y-3">
                    {topic.comments.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8FAFD] rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-[#EFE6F7] text-[#431A4D] flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                            {c.initials}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900">
                              {c.name}
                            </div>
                            <p className="text-xs sm:text-sm italic text-slate-700 mt-1 leading-relaxed">
                              &ldquo;{c.quote}&rdquo;
                            </p>
                          </div>
                        </div>

                        <span className="font-extrabold text-sm text-slate-700 font-mono shrink-0">
                          {c.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};
