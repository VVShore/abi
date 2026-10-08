import React, { useState, useEffect } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Shield,
  CheckCircle2,
  Sparkles,
  Building,
  Users,
  Target,
  Award,
  Layers,
} from 'lucide-react';

export const PitchDeckModal: React.FC = () => {
  const { company, isPitchDeckModalOpen, setIsPitchDeckModalOpen, triggerToast } = useEvaluation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPitchDeckModalOpen) return;
      if (e.key === 'Escape') {
        setIsPitchDeckModalOpen(false);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPitchDeckModalOpen]);

  if (!isPitchDeckModalOpen) return null;

  const slides = [
    {
      title: 'Executive Title & Cover',
      category: 'Overview',
      content: (
        <div className="h-full flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-[#2A1032] to-[#120516] text-white rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#78BE20]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#78BE20] flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
                {company.name.slice(0, 1)}
              </div>
              <span className="font-extrabold text-xl tracking-tight">{company.name}</span>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#78BE20] border border-[#78BE20]/30 backdrop-blur-xs">
              Cohort 2026.1 Pitch Deck
            </span>
          </div>

          <div className="my-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78BE20]/20 text-[#9fe647] text-xs font-bold uppercase tracking-wider mb-4 border border-[#78BE20]/40">
              <Sparkles className="w-3.5 h-3.5" /> Breakthrough Bioscience Therapeutics
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {company.name}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium mt-3 leading-snug">
              {company.domain}
            </p>
            <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
              Targeted therapeutic solutions eliminating chronic microbial biofilms in outpatient clinical settings.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 font-semibold block">PRESENTED TO:</span>
              <span className="text-white font-bold text-sm">ACC Bioscience Incubator (ABI) Steering Committee</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">DATE:</span>
              <span className="text-white font-bold text-sm">{company.reviewDate}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">STAGE:</span>
              <span className="text-[#78BE20] font-bold text-sm">Seed / Phase 1 Translation</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Problem & Clinical Unmet Need',
      category: 'Clinical Need',
      content: (
        <div className="h-full flex flex-col p-8 sm:p-10 bg-white text-slate-900 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D]">Slide 02 • Clinical Landscape</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">The Biofilm Crisis in Chronic Sinusitis</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto">
            <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col">
              <span className="text-4xl font-black text-rose-600 font-mono">30M+</span>
              <h3 className="font-bold text-slate-900 text-lg mt-2">US Patient Burden</h3>
              <p className="text-sm text-slate-600 mt-2">
                Chronic Rhinosinusitis (CRS) affects over 12% of the adult population, resulting in 18M physician visits annually.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col">
              <span className="text-4xl font-black text-amber-600 font-mono">1,000x</span>
              <h3 className="font-bold text-slate-900 text-lg mt-2">Antibiotic Resistance</h3>
              <p className="text-sm text-slate-600 mt-2">
                Bacterial biofilms form protective EPS extracellular matrix shielding bacteria from systemic antibiotics and host immunity.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col">
              <span className="text-4xl font-black text-[#431A4D] font-mono">$12.8B</span>
              <h3 className="font-bold text-slate-900 text-lg mt-2">Annual Healthcare Cost</h3>
              <p className="text-sm text-slate-600 mt-2">
                High surgical revision rates (25% in 3 years) due to persistent microbial recolonization of sinus cavities.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-center gap-3">
            <span className="font-bold text-[#431A4D] shrink-0">KEY TAKEAWAY:</span>
            <span>Current standard of care is invasive surgical scraping or ineffective prolonged oral antibiotics with severe systemic side effects.</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Proprietary Solution & Mechanism',
      category: 'Technology',
      content: (
        <div className="h-full flex flex-col p-8 sm:p-10 bg-white text-slate-900 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D]">Slide 03 • Platform Science</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Enzymatic Biofilm Disruption Formulation</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#78BE20] uppercase tracking-wider">Dual Mechanism of Action</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Enzymatic Lysis + Microbicidal Potentiation</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Cleaves eDNA and extracellular polysaccharide bridges in &lt;15 min.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Converts recalcitrant dormant persister cells into susceptible planktonic state.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Delivered through standard outpatient ENT catheter or irrigant device.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>In-vitro eradication: <strong className="text-slate-900">99.8%</strong></span>
                <span>Ciliary toxicity: <strong className="text-emerald-700">Zero observed</strong></span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFD] border-2 border-[#431A4D]/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#431A4D] uppercase tracking-wider">Why It Wins</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">Seamless ENT In-Office Workflow</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Unlike rival formulations requiring surgical operating room setup, {company.name}&apos;s buffer stability allows 5-minute chairside administration during routine balloon sinuplasty or endoscopy.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800">
                Existing CPT Codes: 31231, 31237 (ENT In-office diagnostic and therapeutic lavage)
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Intellectual Property & Regulatory Strategy',
      category: 'IP & Regulatory',
      content: (
        <div className="h-full flex flex-col p-8 sm:p-10 bg-white text-slate-900 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D]">Slide 04 • Defensibility</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">IP Moat &amp; Regulatory Roadmap</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Patent Portfolio Status
              </h3>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block text-xs uppercase">Provisional Application 63/819,204</span>
                  <span className="text-slate-800 font-semibold text-sm">Stable Multi-Enzyme Biofilm Solubilization Matrix</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block text-xs uppercase">Provisional Application 63/901,112</span>
                  <span className="text-slate-800 font-semibold text-sm">Catheter Delivery &amp; Temperature-Responsive Hydrogel Carrier</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#431A4D]" /> FDA Regulatory Strategy
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#431A4D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>510(k) Medical Device Clearance</strong> via predicate saline lavage devices with enhanced therapeutic classification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#431A4D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span><strong>FDA Q-Submission:</strong> Pre-submission meeting scheduled for Q2 2026 with FDA CDRH panel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#431A4D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span>Experienced regulatory consulting firm retained (former FDA lead reviewers).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Leadership Team & Steering Alignment',
      category: 'Team',
      content: (
        <div className="h-full flex flex-col p-8 sm:p-10 bg-white text-slate-900 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D]">Slide 05 • Execution Capacity</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Founding Leadership &amp; Domain Expertise</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#431A4D] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#431A4D] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                PH
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dr. Philip Henderson, MD</h3>
                <span className="text-xs font-bold text-[#431A4D] block mb-2">Chief Executive Officer &amp; Co-Founder</span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Board-certified Otolaryngologist with 15+ years of clinical practice in Austin. Treated 4,000+ CRS patients; serial angel investor in life sciences.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#78BE20] text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                ER
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dr. Elena Rostova, PhD</h3>
                <span className="text-xs font-bold text-[#78BE20] block mb-2">Chief Scientific Officer &amp; Co-Founder</span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Microbiologist &amp; enzymologist. Former Postdoctoral Fellow at UT Austin Biofilm Center. 18 peer-reviewed publications on bacterial EPS matrix disassembly.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center justify-between">
            <span><strong>Coachability Commitment:</strong> Founders eagerly requested dedicated mentor pairings for regulatory filing and ACC student bench internships.</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Incubator Ask & Milestones',
      category: 'ABI Incubation Plan',
      content: (
        <div className="h-full flex flex-col p-8 sm:p-10 bg-white text-slate-900 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#431A4D]">Slide 06 • Incubation Roadmap</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">ACC Bioscience Incubator Engagement</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-[#431A4D] uppercase">1. Facility Request</div>
              <h3 className="font-bold text-slate-900 text-base mt-1 mb-2">Wet Lab Space &amp; BSL-2</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                2 dedicated lab benches at ABI for bacterial biofilm culture, spectrophotometry assays, and formulation stability testing.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-[#78BE20] uppercase">2. Student Engagement</div>
              <h3 className="font-bold text-slate-900 text-base mt-1 mb-2">ACC Workforce Mentorship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hiring 2 ACC Biotechnology associate degree students for paid lab technician internships supporting assay replicates.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-indigo-600 uppercase">3. Capital Requirement</div>
              <h3 className="font-bold text-slate-900 text-base mt-1 mb-2">$750k Seed Round</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                $400k already committed by local ENT physicians and angel groups; 12-month runway through FDA pre-sub completion.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#431A4D] text-white flex items-center justify-between text-xs sm:text-sm">
            <span>Target Admission: <strong>Cohort 2026.1</strong> • Move-in Date: <strong>Feb 15, 2026</strong></span>
            <span className="font-bold text-[#78BE20]">Recommendation: FULL ADMISSION</span>
          </div>
        </div>
      ),
    },
  ];

  const handleDownloadPDF = () => {
    triggerToast(
      'Download Started',
      `Downloading ${company.name}_Pitch_Deck_Cohort2026.1.pdf for offline review.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden max-h-[92vh]">
        {/* Top Modal Navigation Bar */}
        <div className="px-5 sm:px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 id="deck-modal-title" className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                <span>{company.name} - Pitch Deck (Cohort 2026.1).pdf</span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  <Shield className="w-3 h-3 text-[#78BE20]" /> Committee Confidential
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Slide {currentSlide + 1} of {slides.length} • {slides[currentSlide].title}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 rounded-xl p-1 border border-slate-700 text-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1 min-w-[42px] text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 130))}
                className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Download PDF button */}
            <button
              onClick={handleDownloadPDF}
              className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download Pitch Deck PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsPitchDeckModalOpen(false)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Display Area */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[460px]">
          <div
            className="w-full max-w-4xl aspect-[16/10] transition-transform duration-200 shadow-2xl"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
          >
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Bottom Slide Strip & Controls */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
              disabled={currentSlide === slides.length - 1}
              className="h-10 px-3.5 rounded-xl bg-[#431A4D] hover:bg-[#582365] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              aria-label="Next Slide"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide thumbnail dots / numbers */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-[#78BE20] text-slate-950 font-black shadow-xs scale-105'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
                title={`Go to slide ${idx + 1}: ${s.title}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">←</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">→</kbd> to navigate
          </div>
        </div>
      </div>
    </div>
  );
};
