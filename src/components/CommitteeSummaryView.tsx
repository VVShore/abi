import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { AbiLogo } from './AbiLogo';
import {
  FileText,
  Printer,
  Edit3,
  Check,
  Linkedin,
  Calendar,
  Building2,
  Users,
  Quote,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';

interface FeedbackSectionData {
  id: string;
  title: string;
  prompt: string;
  summary: string;
  quotes?: string[];
  categoryScoreKey?: 'team' | 'market' | 'fit' | 'risk';
}

export const CommitteeSummaryView: React.FC = () => {
  const {
    company,
    reviewers,
    committeeMatrix,
    approveCommitteeReview,
    triggerToast,
  } = useEvaluation();

  const [isEditing, setIsEditing] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);

  // Header metadata state (defaults to PDF structure while dynamically reflecting company or allowing edit)
  const [companyNameDisplay, setCompanyNameDisplay] = useState<string>(company.name || 'Example Company 2');
  const [pitchDateDisplay, setPitchDateDisplay] = useState<string>(company.reviewDate || 'January 1st, 2023');

  // Sync when active company switches
  React.useEffect(() => {
    setCompanyNameDisplay(company.name);
    setPitchDateDisplay(company.reviewDate);
  }, [company.id, company.name, company.reviewDate]);

  // Exact sections from the Member Company Pitch Feedback Summary PDF
  const [sections, setSections] = useState<FeedbackSectionData[]>([
    {
      id: 'overall',
      title: 'OVERALL FEEDBACK',
      prompt: 'What is the overall view on the company, where it is at now, and its future path.',
      summary:
        'Company is a small team with a potentially very valuable technology portfolio once the injection technology and therapeutic component are married. However, each may be valuable independently. The team possesses the technical expertise to drive progress at a high-level but will need support from staff in the laboratory and experts or advisors in the non-technical aspects of the business, such as the regulatory pathway, business development, and connections to partners. This technology is at the stage where partnership with ABI is both appropriate, feasible, and desirable, though they may quickly outgrow the facility. Marcel personally appears to be a driven, successful, and conscientious member of the community and would be welcome in the Austin ecosystem. Because of this the committee has recommended that Company be offered admission into the Incubator.',
    },
    {
      id: 'team',
      title: 'FEEDBACK ON TEAM',
      prompt: 'Does the company possess the internal talent and/or hired external talent needed to make progress?',
      categoryScoreKey: 'team',
      summary:
        'There appears to be no concern about the technical expertise that Company has access to. The two largest gaps identified by the committee would be (1) selection of the appropriate laboratory staff to conduct the work and (2) collaborators, advisors, or staff to provide insight to the non-technical aspects of the business (i.e. business development, regulatory partners).',
      quotes: [
        'He will need lab staff and some business help. He acknowledged the lab need.',
        "I think they're likely qualified to succeed with solution development. Commercial success is a different question. He is an accomplished PI with a long track record in the field.",
        'He seems to have many many academic collaborators and experience, but may need to engage other stakeholders in Austin ecosystem.',
      ],
    },
    {
      id: 'abi_fit',
      title: 'FEEDBACK ON RELATIONSHIP WITH ABI',
      prompt: 'Does the mission of the company align with ABI? Would a relationship between the company and ABI be beneficial to both parties?',
      categoryScoreKey: 'fit',
      summary:
        'The facility offered by ABI appears to have the vast majority of the instrumentation that the company would need for internal R&D as well as some validation. The size of the company also aligns with ABI’s portfolio. They will need to hire staff to conduct the work at the incubator and ensure those staff work well in these spaces. They will also need to conduct animal work at some point outside of ABI.',
      quotes: [
        '[Company would need] Cell culture, flow, qPCR, etc. They want to do assay dev and development of cell differentiation procedure. No animal work being done.',
        "This wasn't completely clear to me. It seems like the space might be useful for making cells and assay development, but the case wasn't super-strong.",
        'Yes he will be fine here [at ABI]',
      ],
    },
    {
      id: 'business_plan',
      title: 'FEEDBACK ON BUSINESS PLAN',
      prompt: 'Does the company have a solution that is viable, desirable, and feasible? Is there a clear path to commercialization of the technology?',
      categoryScoreKey: 'market',
      summary:
        'The current targeted exit strategy seems to likely be acquisition due to the extended timeline to get their technology into patients. This is due in large part due to the novelty of the technology but also due to the market space they are entering (therapeutics). This is a risky strategy due to many factors and may be ameliorated to some extent by developing relationships with key stakeholders (and potential customers) now and possibly pursuing licensing opportunities. The committee identified a significant amount of risk here and addition of expertise in this space (business development, regulatory, etc) via staff or advisors will be key. There was also concern about expired patents.',
      quotes: [
        'Far from commercial readiness. Exit strategy seems to be pre-revenue acquisition, which is definitely risky / lower probability.',
        "It feels like they've figured out a potentially better solution to a problem that people want solved. It's not clear that they've figured out if someone would be willing to pay for the solution. (Focus was more on company acquisition than on the end customer.)",
        'This product has a long way to go. Direct injection of modified cells to the center of the brain will be a hard sell.',
      ],
    },
    {
      id: 'technology',
      title: 'FEEDBACK ON TECHNOLOGY',
      prompt: 'Does the company have a technology that has been developed or there is significant confidence in it being developed?',
      categoryScoreKey: 'risk',
      summary:
        "The technology appears to be at a very early stage, but has a large potential for dramatic improvement relative to competitors. This means the risk is high, but the potential is very great. Identifying the key ‘go / no-go’ experiments at ABI and technological gates more broadly will be key in maintaining momentum. The specific injection technology may have more monetary value than the cellular component at the end of the day, and further development and/or protection of this technology can de-risk the less mature therapeutic and cellular component. The regulatory risk of this technology should not be underestimated and evaluated internally and with advisors and external stakeholders.",
      quotes: [
        'The major value add for their tech is the surgical implantation, which is far above competitors. Specific cell enrichment is slightly better, but less separation it seems.',
        'It [the technology] is well defined, but complicated.',
        'No iPS derived cell therapy has been approved previously, so risk there. Not personalized, they want allogeneic therapy from one single cell line',
      ],
    },
  ]);

  const handleSummaryChange = (id: string, newSummary: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, summary: newSummary } : sec))
    );
  };

  const handleQuoteChange = (sectionId: string, quoteIdx: number, newQuote: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId || !sec.quotes) return sec;
        const updated = [...sec.quotes];
        updated[quoteIdx] = newQuote;
        return { ...sec, quotes: updated };
      })
    );
  };

  const handleAddQuote = (sectionId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          quotes: [...(sec.quotes || []), 'New committee observation or quote...'],
        };
      })
    );
  };

  const handleRemoveQuote = (sectionId: string, quoteIdx: number) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId || !sec.quotes) return sec;
        return {
          ...sec,
          quotes: sec.quotes.filter((_, idx) => idx !== quoteIdx),
        };
      })
    );
  };

  const handlePrintPDF = () => {
    if (isEditing) {
      setIsEditing(false);
    }
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    triggerToast(
      'PDF Summary Updated',
      'Committee summary content saved and ready for PDF export.',
      'success'
    );
  };

  return (
    <div className="w-full pt-6 sm:pt-8 pb-24 bg-[#F8FAFD] min-h-screen text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-8">
        {/* ===================================================================== */}
        {/* TOP CONTROL & STATUS BAR (Webpage Theme, Hidden when printing PDF)    */}
        {/* ===================================================================== */}
        <section className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-7 relative overflow-hidden print:hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#431A4D] via-[#78BE20] to-[#431A4D]" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-[#431A4D] text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#78BE20]" />
                  PDF Export Preview
                </span>
                <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                  Review &amp; verify exact PDF contents before exporting
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Committee Summary &amp; Pitch Feedback Document
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                This view reflects the exact structure and synthesized feedback that will be generated in the official{' '}
                <strong className="text-slate-800">Member Company Pitch Feedback Summary PDF</strong>.
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveEdits}
                  className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#78BE20] hover:bg-[#68a81b] text-slate-950 font-extrabold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Done Editing</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-slate-300 hover:border-[#431A4D] bg-white text-slate-800 hover:text-[#431A4D] font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>Edit PDF Text</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePrintPDF}
                className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#431A4D] hover:bg-[#34143D] text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#78BE20]" />
                <span>Export to PDF</span>
              </button>
            </div>
          </div>

          {/* Optional Collapsible Numerical Scoreboard Reference */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#78BE20]" />
                  Committee Consensus Score:{' '}
                  <strong className="text-[#431A4D] font-mono text-base">
                    {committeeMatrix.categoryAverages.total.toFixed(1)} / 5.0
                  </strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended for Admission
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowScoreboard(!showScoreboard)}
                className="text-xs font-bold text-[#431A4D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showScoreboard ? 'Hide Numerical Scoreboard' : 'View Numerical Scoreboard Breakdown'}</span>
                {showScoreboard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showScoreboard && (
              <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden animate-fadeIn">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-3 px-4">Reviewer</th>
                        <th className="py-3 px-3 text-center">Team</th>
                        <th className="py-3 px-3 text-center">Value Prop</th>
                        <th className="py-3 px-3 text-center">ABI Fit</th>
                        <th className="py-3 px-3 text-center">Risk</th>
                        <th className="py-3 px-4 text-right">Avg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70">
                      {committeeMatrix.reviewerRows.map((row) => (
                        <tr key={row.reviewer.id} className="hover:bg-white/80">
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            {row.reviewer.name}{' '}
                            <span className="text-slate-400 font-normal text-xs">({row.reviewer.title})</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold">{row.teamAvg.toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold">{row.marketAvg.toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold">{row.fitAvg.toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold">{row.riskAvg.toFixed(1)}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-black text-[#431A4D]">
                            {row.overallAvg.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================== */}
        {/* MAIN PDF DOCUMENT CONTAINER (Styled in Webpage Theme + Print Ready)   */}
        {/* ===================================================================== */}
        <article className="bg-white border-2 border-slate-200/90 rounded-3xl shadow-md p-6 sm:p-10 md:p-12 space-y-10 print:border-0 print:shadow-none print:p-0">
          {/* 1. Official ABI Header Lockup & Intro Letter (Matches Page 1 of PDF) */}
          <header className="border-b-2 border-slate-200 pb-8">
            <div className="flex flex-col items-center text-center mb-6">
              <AbiLogo size={56} showText={true} />
              <div className="mt-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#431A4D] tracking-tight">
                  ACC Bioscience Incubator
                </h2>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mt-0.5">
                  Member Company Pitch Feedback Summary
                </h3>
              </div>
            </div>

            {/* Synthesized Intro Paragraphs from PDF */}
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-sm sm:text-[15px] text-slate-700 space-y-4 leading-relaxed">
              <p>
                Thank you for your pitch for membership at the ACC Bioscience Incubator (ABI). As part of the pitch
                process we want to provide you with the feedback from the committee on the pitch, your company, and the
                fit with ABI.
              </p>
              <p>
                We synthesized the feedback from all steering committee members and have summarized it below for your
                reference. While none of this is binding, please consider this feedback and use it to help your company
                grow and develop into its next stage. The contact information of all your committee members is provided
                below as well if you would like to reach out to them. Please let ABI staff know if you have any
                questions or would like further clarification.
              </p>
              <p className="font-bold text-[#431A4D]">Thank you!</p>
            </div>

            {/* Company Name, Steering Committee LinkedIn Roster, and Pitch Date */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Left: Company Name & Pitch Date */}
              <div className="space-y-4">
                <div className="bg-[#F8FAFD] border border-slate-200 rounded-2xl p-4">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#431A4D]" />
                    <span>COMPANY NAME:</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyNameDisplay}
                      onChange={(e) => setCompanyNameDisplay(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border-2 border-slate-300 font-black text-lg text-slate-900 focus:outline-none focus:border-[#431A4D]"
                    />
                  ) : (
                    <div className="text-lg sm:text-xl font-black text-slate-900 border-b-2 border-slate-300 pb-1">
                      {companyNameDisplay}
                    </div>
                  )}
                </div>

                <div className="bg-[#F8FAFD] border border-slate-200 rounded-2xl p-4">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#78BE20]" />
                    <span>PITCH DATE:</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={pitchDateDisplay}
                      onChange={(e) => setPitchDateDisplay(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border-2 border-slate-300 font-bold text-base text-slate-900 focus:outline-none focus:border-[#431A4D]"
                    />
                  ) : (
                    <div className="text-base sm:text-lg font-bold text-slate-900 border-b-2 border-slate-300 pb-1">
                      {pitchDateDisplay}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Steering Committee LinkedIn List */}
              <div className="bg-[#F8FAFD] border border-slate-200 rounded-2xl p-4 sm:p-5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                  <Users className="w-3.5 h-3.5 text-[#431A4D]" />
                  <span>STEERING COMMITTEE:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {reviewers.map((rev, index) => (
                    <li
                      key={rev.id}
                      className="flex items-center gap-2.5 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#431A4D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {rev.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{rev.name}</div>
                        <a
                          href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
                            rev.name + ' Austin Bioscience'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A66C2] hover:underline"
                        >
                          <Linkedin className="w-3 h-3" />
                          <span>Reviewer {index + 1} LinkedIn</span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </header>

          {/* ===================================================================== */}
          {/* 2. PDF FEEDBACK SECTIONS (Overall, Team, Relationship with ABI,        */}
          {/*    Business Plan, Technology)                                         */}
          {/* ===================================================================== */}
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <section
                key={section.id}
                className="bg-[#F8FAFD] border-2 border-slate-200/90 rounded-2xl p-6 sm:p-7 transition-all print:bg-white print:border-slate-300 print:break-inside-avoid"
              >
                {/* Section Title & Prompt Question */}
                <div className="border-b border-slate-200 pb-4 mb-5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#431A4D] text-white flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[#431A4D] tracking-tight underline decoration-[#78BE20] decoration-2 underline-offset-4">
                        {section.title}
                      </h3>
                    </div>

                    {section.categoryScoreKey && (
                      <span className="text-xs font-bold bg-white text-slate-700 px-3 py-1 rounded-full border border-slate-200 shadow-2xs print:hidden">
                        Category Consensus:{' '}
                        <strong className="text-[#431A4D] font-mono">
                          {committeeMatrix.categoryAverages[section.categoryScoreKey].toFixed(1)} / 5.0
                        </strong>
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base italic text-slate-700 font-medium mt-2">
                    {section.prompt}
                  </p>
                </div>

                {/* Summary Block */}
                <div className="mb-6">
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#431A4D]" />
                    <span>Summary:</span>
                  </h4>

                  {isEditing ? (
                    <textarea
                      rows={5}
                      value={section.summary}
                      onChange={(e) => handleSummaryChange(section.id, e.target.value)}
                      className="w-full p-4 rounded-xl bg-white border-2 border-slate-300 text-sm sm:text-[15px] text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#431A4D] focus:border-[#431A4D]"
                    />
                  ) : (
                    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 text-sm sm:text-[15px] text-slate-800 leading-relaxed shadow-2xs">
                      {section.summary}
                    </div>
                  )}
                </div>

                {/* Select Quotes from Committee Block (for sections with quotes) */}
                {section.quotes && (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Quote className="w-4 h-4 text-[#78BE20]" />
                        <span>Select Quotes from Committee:</span>
                      </h4>

                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleAddQuote(section.id)}
                          className="text-xs font-bold text-[#431A4D] hover:bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Quote</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {section.quotes.map((quote, qIdx) => (
                        <div key={qIdx} className="relative">
                          {isEditing ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                rows={2}
                                value={quote}
                                onChange={(e) => handleQuoteChange(section.id, qIdx, e.target.value)}
                                className="flex-1 p-3 rounded-xl bg-white border-2 border-slate-300 text-sm italic text-slate-800 focus:outline-none focus:border-[#431A4D]"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveQuote(section.id, qIdx)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer mt-1"
                                title="Remove quote"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <blockquote className="bg-white border-l-4 border-l-[#431A4D] border border-slate-200/80 rounded-r-xl py-3 px-4 text-sm sm:text-[15px] italic text-slate-700 leading-relaxed shadow-2xs">
                              &ldquo;{quote}&rdquo;
                            </blockquote>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>

        {/* ===================================================================== */}
        {/* BOTTOM EXPORT & APPROVAL ACTION BAR (Hidden when printing PDF)        */}
        {/* ===================================================================== */}
        <section className="bg-white rounded-3xl border-2 border-[#431A4D]/20 shadow-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#431A4D]">
              Ready for Export &amp; Distribution
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Member Company Pitch Feedback Summary PDF
            </h3>
            <p className="text-sm text-slate-600 font-medium max-w-xl">
              All 5 PDF sections (Overall Feedback, Team, Relationship with ABI, Business Plan, and Technology) are
              formatted and ready to export as an official PDF for {companyNameDisplay}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={handlePrintPDF}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-white text-[#431A4D] border-2 border-[#431A4D] hover:bg-[#F3EBFA] font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Export to PDF</span>
            </button>

            <button
              type="button"
              onClick={approveCommitteeReview}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-2xl bg-[#431A4D] text-white hover:bg-[#34143D] font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#431A4D]/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#78BE20]" />
              <span>Approve &amp; Finalize Summary</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
