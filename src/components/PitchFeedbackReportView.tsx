import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
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
  reviewerLabel: string;
  sentiment: 'positive' | 'concern';
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

interface AreaToAddressTopic {
  id: string;
  title: string;
  summary: string;
  items: GapItem[];
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

  // Section 2 state: all theme quotes collapsed by default
  const [expandedThemes, setExpandedThemes] = useState<Record<string, boolean>>({
    theme_coachable: false,
    theme_facility: false,
    theme_hardware: false,
    theme_staffing: false,
  });

  // Section 3 state: all 4 Areas to Address topic accordions collapsed by default
  const [expandedGapTopics, setExpandedGapTopics] = useState<Record<string, boolean>>({
    gap_topic_staffing: false,
    gap_topic_regulatory: false,
    gap_topic_ip: false,
    gap_topic_funding: false,
  });

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

  // 2. What Reviewers Noticed Data
  const consensusThemes: ConsensusTheme[] = [
    {
      id: 'theme_coachable',
      reviewerLabel: '3 reviewers',
      sentiment: 'positive',
      title: 'Open to Coaching',
      summary:
        'Reviewers described the founder as receptive to feedback and training.',
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
      reviewerLabel: 'All reviewers',
      sentiment: 'positive',
      title: 'Strong Facility Fit',
      summary:
        'The proposed work fits ACC Highland’s existing equipment and facilities.',
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
      reviewerLabel: '4 of 6 reviewers',
      sentiment: 'positive',
      title: 'Device Drives Commercial Value',
      summary:
        'Reviewers saw the delivery device as the strongest commercial differentiator.',
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
      reviewerLabel: '4 of 6 reviewers',
      sentiment: 'concern',
      title: 'Staffing and Founder Capacity',
      summary:
        'Reviewers raised concerns about lab staffing and reliance on one founder.',
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

  // 3. Areas to Address Topic Groups (Single-Column Accordion Data)
  const areasToAddressTopics: AreaToAddressTopic[] = [
    {
      id: 'gap_topic_staffing',
      title: 'Lab Staffing and Founder Capacity',
      summary:
        'Reviewers raised concerns about dedicated lab staffing and the founder’s capacity to operate the lab.',
      items: [
        {
          id: 'gap_1',
          reviewer: 'Jesper Marklund',
          score: 2,
          quote:
            "This technology is far from validation. An investor would hesitate. He'd need to hire dedicated lab staff immediately; Marcel cannot operate wet lab equipment alone.",
          category: 'Team Competency',
          subCriterion: 'Operational Execution & Staffing',
        },
      ],
    },
    {
      id: 'gap_topic_regulatory',
      title: 'Regulatory Pathway',
      summary:
        'Reviewers flagged uncertainty about the applicable regulatory pathway and the device-versus-drug classification.',
      items: [
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
      ],
    },
    {
      id: 'gap_topic_ip',
      title: 'Intellectual Property and Freedom to Operate',
      summary:
        'Reviewers questioned patent coverage, patent status, and freedom to operate.',
      items: [
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
      ],
    },
    {
      id: 'gap_topic_funding',
      title: 'Funding and Commercial Readiness',
      summary:
        'Reviewer feedback highlighted vulnerability around securing equity co-investors.',
      items: [
        {
          id: 'gap_8',
          reviewer: 'Kevin Smith',
          score: 2,
          quote: 'Very vulnerable without closed equity co-investors.',
          category: 'Risk & Commercial',
          subCriterion: 'Runway & Commercialization',
        },
      ],
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

  const renderTopicIcon = (type: TopicGroup['icon'], isLight = false) => {
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
        {/* PAGE HEADER BANNER (Webpage Theme)                                    */}
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
                  Applicant: <strong className="text-slate-900">{company.name}</strong> • Reviewed {company.reviewDate}
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
        {/* 1. CATEGORY AVERAGES & REVIEWER SPREAD DISTRIBUTION (Page 1 of PDF)   */}
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
        {/* 2. WHAT REVIEWERS NOTICED                                             */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              What Reviewers Noticed
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Common themes across reviewer feedback. Open a theme to see supporting quotes.
            </p>
          </div>

          {/* 2-Column Desktop / 1-Column Mobile Grid of Theme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7 items-start">
            {consensusThemes.map((theme) => {
              const isExpanded = Boolean(expandedThemes[theme.id]);
              const isPositive = theme.sentiment === 'positive';

              return (
                <div
                  key={theme.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 transition-colors hover:border-slate-300"
                >
                  {/* Title & Subtle Reviewer-Count Label */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {theme.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                        isPositive
                          ? 'bg-status-success-light text-prototype-detail-3 border border-accent/30'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isPositive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                      {theme.reviewerLabel}
                    </span>
                  </div>

                  {/* One-Sentence Summary */}
                  <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
                    {theme.summary}
                  </p>

                  {/* Accessible Quote Reveal Control */}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => toggleThemeCard(theme.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`theme-quotes-${theme.id}`}
                      className="inline-flex items-center gap-1.5 py-1.5 px-2.5 -ml-2.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <span>
                        {isExpanded
                          ? 'Hide quotes'
                          : `View ${theme.quotes.length} reviewer quotes`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 transition-transform" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 transition-transform" />
                      )}
                    </button>
                  </div>

                  {/* Supporting Quotes Beneath Summary */}
                  {isExpanded && (
                    <div
                      id={`theme-quotes-${theme.id}`}
                      className="mt-4 pt-5 border-t border-slate-100 space-y-4"
                    >
                      {theme.quotes.map((q, qIdx) => (
                        <blockquote
                          key={qIdx}
                          className="pl-4 border-l-2 border-slate-200 space-y-1.5"
                        >
                          <p className="text-sm text-slate-700 leading-relaxed">
                            &ldquo;{q.quote}&rdquo;
                          </p>
                          <footer className="text-xs flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {q.author}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-500">{q.role}</span>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. AREAS TO ADDRESS                                                   */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Areas to Address
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Concerns flagged by reviewers who gave a score of 1 or 2. Open a topic to see their feedback.
            </p>
          </div>

          {/* Single-Column Accordion of 4 Topic Groups */}
          <div className="mt-7 space-y-4">
            {areasToAddressTopics.map((topic) => {
              const isExpanded = Boolean(expandedGapTopics[topic.id]);
              const count = topic.items.length;

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 transition-colors hover:border-slate-300"
                >
                  {/* Title & Subtle Feedback Count */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {topic.title}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50/80 text-amber-900 border border-amber-200/80 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {count === 1 ? '1 comment' : `${count} comments`}
                    </span>
                  </div>

                  {/* One-Sentence Summary */}
                  <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
                    {topic.summary}
                  </p>

                  {/* Accessible Accordion Control */}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => toggleGapTopic(topic.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`gap-topic-items-${topic.id}`}
                      className="inline-flex items-center gap-1.5 py-1.5 px-2.5 -ml-2.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <span>
                        {isExpanded
                          ? `Hide ${count === 1 ? 'reviewer comment' : 'reviewer comments'}`
                          : `View ${count} ${count === 1 ? 'reviewer comment' : 'reviewer comments'}`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 transition-transform" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 transition-transform" />
                      )}
                    </button>
                  </div>

                  {/* Supporting Reviewer Feedback */}
                  {isExpanded && (
                    <div
                      id={`gap-topic-items-${topic.id}`}
                      className="mt-4 pt-5 border-t border-slate-100 divide-y divide-slate-100"
                    >
                      {topic.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-4 first:pt-0 last:pb-0"
                        >
                          <blockquote className="pl-4 border-l-2 border-amber-300/90 space-y-2">
                            <p className="text-sm text-slate-700 leading-relaxed">
                              &ldquo;{item.quote}&rdquo;
                            </p>
                            <footer className="text-xs flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
                              <span className="font-semibold text-slate-900">
                                {item.reviewer}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-500">
                                Rating: {item.score} of 5
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-500">
                                {item.category}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-500">
                                {item.subCriterion}
                              </span>
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
        </section>

        {/* ===================================================================== */}
        {/* 4. REVIEWER COMMENTS BY TOPIC (Page 4 of PDF)                         */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          <div className="pb-5 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight uppercase">
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
                        ? 'bg-prototype-detail-4 text-white shadow-xs'
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
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-text-main">
                    {renderTopicIcon(topic.icon, false)}
                    <span>{topic.uppercaseTitle}</span>
                  </div>

                  <div className="space-y-3">
                    {topic.comments.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-canvas rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
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
