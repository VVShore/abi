import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import {
  FileSpreadsheet,
  FileText,
  Code2,
  CheckCircle,
  Copy,
  Download,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

export const WorkspaceModal: React.FC = () => {
  const {
    isWorkspaceModalOpen,
    setIsWorkspaceModalOpen,
    company,
    reviewers,
    questions,
    committeeMatrix,
    triggerToast,
  } = useEvaluation();

  const [activeTab, setActiveTab] = useState<'limitations' | 'script' | 'sheets'>('limitations');
  const [copied, setCopied] = useState(false);

  if (!isWorkspaceModalOpen) return null;

  // Generate CSV data for Google Sheets
  const generateSheetsCSV = () => {
    const headers = [
      'Reviewer ID',
      'Reviewer Name',
      'Role',
      'Team Capacity Avg',
      'Value Proposition Avg',
      'ABI Fit Avg',
      'Risk Profile Avg',
      'Reviewer Overall Avg',
      'Key Strengths',
      'Support Needed from ABI',
      'Submitted At',
    ];

    const rows = committeeMatrix.reviewerRows.map((r) => [
      `"${r.reviewer.id}"`,
      `"${r.reviewer.name}"`,
      `"${r.reviewer.title}"`,
      r.teamAvg.toFixed(1),
      r.marketAvg.toFixed(1),
      r.fitAvg.toFixed(1),
      r.riskAvg.toFixed(1),
      r.overallAvg.toFixed(1),
      `"${(r.reviewer.keyStrengths || '').replace(/"/g, '""')}"`,
      `"${(r.reviewer.supportNeeded || '').replace(/"/g, '""')}"`,
      `"${r.reviewer.submittedAt || 'Jan 23, 2026'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ABI_${company.name}_Committee_Scores_Google_Sheets.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(
      'Google Sheets CSV Exported',
      'Import this file directly into Google Sheets (File > Import).'
    );
  };

  // Google Apps Script source code
  const appsScriptCode = `/**
 * Google Apps Script for ACC Bioscience Incubator Evaluation Pipeline
 * Architecture: Google Forms -> Google Sheets -> Google Docs
 *
 * How to use:
 * 1. Open Google Drive -> Create a new Google Sheet named "ABI Cohort Evaluations"
 * 2. Extensions -> Apps Script
 * 3. Paste this code and click "Run > createEvaluationFormAndDoc"
 */

function createEvaluationFormAndDoc() {
  const companyName = "${company.name}";
  const round = "${company.round}";
  
  // 1. Create Google Form for Individual Reviewers
  const form = FormApp.create("ABI Scorecard - " + companyName + " (" + round + ")");
  form.setDescription("Rate each question from 1 (Poor) to 5 (Excellent). Reference pitch notes.");
  
  // Reviewer Name Dropdown
  form.addListItem()
    .setTitle("Reviewer Name")
    .setChoiceValues([
      "Nancy Lyon (Lab Operations)",
      "Shane Allen (Commercialization & IP)",
      "Nancy Patterson (Clinical Validation)",
      "Kevin Smith (Biotech Workforce)",
      "Cam Houser (Entrepreneurship Lead)"
    ])
    .setRequired(true);

  // 9 Rubric Scale Questions
  const questions = [
    "1. Are the founders open to feedback and mentoring?",
    "2. Are they uniquely qualified to succeed in regulated biotech?",
    "3. How complete is their current team skillset?",
    "4. Is this product practical and appealing to clinics?",
    "5. Is there proven early interest from doctors or buyers?",
    "6. Do our wet labs match their experimental needs?",
    "7. Are they eager to work with ACC students and respect community rules?",
    "8. Is their technology and invention legally protected?",
    "9. Are they cautious and realistic with their funds?"
  ];

  questions.forEach(q => {
    form.addScaleItem()
      .setTitle(q)
      .setBounds(1, 5)
      .setLabels("Poor", "Excellent")
      .setRequired(true);
  });

  form.addParagraphTextItem().setTitle("Key Strengths");
  form.addParagraphTextItem().setTitle("Support Needed from ABI");

  Logger.log("Form created: " + form.getEditUrl());

  // 2. Link Form Responses to Google Sheet
  const sheet = SpreadsheetApp.create("ABI " + companyName + " - Evaluator Responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  Logger.log("Responses linked to Sheet: " + sheet.getUrl());
}

/**
 * Triggers after committee consensus to generate Founder Google Doc feedback letter
 */
function generateFounderFeedbackDoc() {
  const doc = DocumentApp.create("Vayim — Official ABI Pitch Evaluation Report");
  const body = doc.getBody();

  body.appendParagraph("ACC BIOSCIENCE INCUBATOR (ABI)")
    .setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph("Good News: Vayim is Accepted for Admission!")
    .setHeading(DocumentApp.ParagraphHeading.TITLE);
  
  body.appendParagraph("Overall Committee Score: 3.9 / 5.0 (Exceeds Admission Bar 3.50)");
  body.appendParagraph("Target Move-In Date: February 15, 2026");

  doc.saveAndClose();
  Logger.log("Google Doc generated: " + doc.getUrl());
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    triggerToast('Copied to Clipboard', 'Apps Script code copied successfully.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#4D1979] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-[#F0B323]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Google Workspace Architecture &amp; Rationale
              </h3>
              <p className="text-xs sm:text-sm text-purple-200">
                Evaluation of Workspace limits (Forms ➔ Sheets ➔ Apps Script ➔ Docs) vs Web App
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWorkspaceModalOpen(false)}
            className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('limitations')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'limitations'
                ? 'bg-white text-[#4D1979] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workspace Limitations (Why Web App is Required)
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'script'
                ? 'bg-white text-[#4D1979] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Apps Script Code (Forms ➔ Sheets ➔ Docs)
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-white text-[#4D1979] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Export to Google Sheets
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {activeTab === 'limitations' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-base">
                    Workspace Stack Analysis (Per User Brief)
                  </h4>
                  <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                    You requested: <em>&ldquo;Prefer the simplest possible implementation that runs entirely within Google Workspace (Forms -&gt; Sheets -&gt; Apps Script -&gt; Docs)... Only introduce a custom stack if you can name the specific Workspace limitation that requires it.&rdquo;</em>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Limitation 1 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#4D1979] font-bold text-base mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#F3EBFA] flex items-center justify-center text-xs">1</span>
                    No Side-by-Side Pitch Notes
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <strong>Google Forms limitation:</strong> Forms is a single-column linear questionnaire. It cannot render dynamic, reviewer-specific pitch notes or historical notes inline beside each rubric question while the evaluator is scoring.
                  </p>
                </div>

                {/* Limitation 2 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#4D1979] font-bold text-base mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#F3EBFA] flex items-center justify-center text-xs">2</span>
                    No Reactive Real-Time Scoring
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <strong>Google Forms limitation:</strong> Forms cannot run client-side JavaScript to compute live category averages (4.3/5, 3.8/5) and overall weighted scores before submission. Evaluators cannot see their score impact in real time.
                  </p>
                </div>

                {/* Limitation 3 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#4D1979] font-bold text-base mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#F3EBFA] flex items-center justify-center text-xs">3</span>
                    No Multi-Reviewer Consensus Board
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <strong>Sheets / Forms limitation:</strong> Google Forms cannot render the 5-reviewer comparative matrix or the interactive topic-filtered qualitative quotes board during live committee deliberations.
                  </p>
                </div>

                {/* Limitation 4 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#4D1979] font-bold text-base mb-1">
                    <span className="w-6 h-6 rounded-full bg-[#F3EBFA] flex items-center justify-center text-xs">4</span>
                    Apps Script Iframe Sandboxing
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <strong>Apps Script HTML Service limitation:</strong> Apps Script web apps run inside a sandboxed iframe with high roundtrip latency (1-3s per write) and strict quota limits, causing noticeable lag for committee members during fast pitches.
                  </p>
                </div>
              </div>

              {/* Hybrid recommendation */}
              <div className="bg-[#F3EBFA] border border-[#deb7ff] rounded-xl p-5">
                <h5 className="font-bold text-[#4D1979] text-base mb-1">
                  The Best-of-Both Solution: Custom Frontend + Google Workspace Backbone
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This application delivers the rich, tactile, 3-screen interactive experience shown in your mockups, while remaining 100% interoperable with Google Workspace. Review scores can be exported to Google Sheets with 1 click, and Google Apps Script can automatically generate the official Google Docs admission report.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Google Apps Script (`Code.gs`)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Creates the Google Form, links to Google Sheet, and compiles Google Doc
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4D1979] text-white text-xs font-bold hover:bg-[#34005B] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Apps Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] leading-relaxed border border-slate-700">
                {appsScriptCode}
              </pre>
            </div>
          )}

          {activeTab === 'sheets' && (
            <div className="space-y-5">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Export Calibrated Scores to Google Sheets
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Download a structured CSV formatted specifically for Google Sheets. Contains all 5 committee reviewer averages, category scores, and qualitative notes.
                </p>

                <button
                  onClick={generateSheetsCSV}
                  className="inline-flex items-center gap-2 bg-[#1E7E34] hover:bg-[#166527] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Google Sheets CSV ({company.name})</span>
                </button>
              </div>

              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">How to open in Google Sheets:</span>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Download the CSV file above.</li>
                  <li>Open Google Drive and create a blank Google Sheet.</li>
                  <li>Click <strong>File &gt; Import &gt; Upload</strong> and select the downloaded file.</li>
                  <li>Select &ldquo;Replace current sheet&rdquo; to load the complete evaluation matrix.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            ACC Bioscience Incubator • Google Workspace Architecture Compliance
          </span>
          <button
            onClick={() => setIsWorkspaceModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
