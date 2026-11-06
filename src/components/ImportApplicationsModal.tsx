import React, { useState, useRef, useId } from 'react';
import * as XLSX from 'xlsx';
import { useEvaluation } from '../context/EvaluationContext';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
  Check,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  Building2,
  Users,
} from 'lucide-react';
import { AbiLogo } from './AbiLogo';
import {
  CompanyAssessment,
  OrganizationContactDetails,
  ApplicationIntakeInfo,
  OrganizationContractDetails,
  MeetingRecord,
} from '../types';
import {
  DEFAULT_CONTRACT_DETAILS,
  DEFAULT_FEEDBACK_SECTIONS,
} from '../data/mockData';

interface ParsedCandidate {
  tempId: string;
  selected: boolean;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  domain: string;
  technologyDescription: string;
  problemStatement: string;
  proposedSolution: string;
  companyHistory: string;
  teamExpertise: string;
  milestones: string;
  funding: string;
  headcount: string;
  accCollaboration: string;
  spaceRequirements: string;
  submittedAt: string;
  rawRow: Record<string, string>;
  isDuplicate: boolean;
  duplicateOf?: string;
  duplicateId?: string;
  duplicateAction: 'new' | 'update' | 'skip';
  isSkipped: boolean;
  skipReason?: string;
}

interface ColumnMapping {
  originalHeader: string;
  normalizedHeader: string;
  mappedField: string;
}

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const ImportApplicationsModal: React.FC = () => {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    companies,
    importCompanies,
    triggerToast,
  } = useEvaluation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [unmappedHeaders, setUnmappedHeaders] = useState<string[]>([]);
  const [parsedCandidates, setParsedCandidates] = useState<ParsedCandidate[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDetectedColumns, setShowDetectedColumns] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isImportModalOpen) return null;

  // Process an uploaded or dropped .xlsx file
  const handleFile = (file: File) => {
    if (!file) return;

    // Validate file type
    const isExcel =
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls') ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (!isExcel) {
      setErrorMessage('Please select a valid Excel workbook file (.xlsx or .xls).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const wb = XLSX.read(buffer, { type: 'array' });

        if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
          setErrorMessage('The uploaded workbook contains no worksheets.');
          setIsProcessing(false);
          return;
        }

        setWorkbook(wb);
        setSheetNames(wb.SheetNames);

        // Auto-select preferred sheet (e.g., sheet with "Form", "Responses", or the first sheet)
        const preferredSheet =
          wb.SheetNames.find(
            (name) =>
              name.toLowerCase().includes('responses') ||
              name.toLowerCase().includes('form') ||
              name.toLowerCase().includes('applications') ||
              name.toLowerCase().includes('lead')
          ) || wb.SheetNames[0];

        setSelectedSheet(preferredSheet);
        parseWorksheet(wb, preferredSheet);
      } catch (err) {
        console.error('Failed to parse Excel file:', err);
        setErrorMessage('Failed to read Excel workbook. Please check the file formatting.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Error reading local file.');
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Parse a specific worksheet using actual headers
  const parseWorksheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    if (!ws) {
      setErrorMessage(`Worksheet "${sheetName}" not found.`);
      return;
    }

    // Convert sheet to array of rows
    const rawData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });

    if (!rawData || rawData.length < 2) {
      setErrorMessage(`Worksheet "${sheetName}" is empty or has no data rows.`);
      setParsedCandidates([]);
      setColumnMappings([]);
      return;
    }

    // Row 0 is assumed to be the header row
    const headers: string[] = (rawData[0] || []).map((h: any) => String(h || '').trim());

    // Map columns
    const mappings: ColumnMapping[] = [];
    const unmapped: string[] = [];

    // Header matching rules for ABI Form to Lead Responses
    const headerMatchMap: Record<string, RegExp[]> = {
      companyName: [
        /company\s*name/i,
        /name\s*of\s*(?:the\s*)?company/i,
        /organization/i,
        /startup\s*name/i,
        /business\s*name/i,
        /^company$/i,
      ],
      contactName: [
        /primary\s*contact/i,
        /contact\s*name/i,
        /your\s*name/i,
        /applicant\s*name/i,
        /founder\s*name/i,
        /full\s*name/i,
        /^name$/i,
      ],
      email: [/email/i, /e-mail/i],
      phone: [/phone/i, /telephone/i, /mobile/i, /cell/i],
      website: [/website/i, /web\s*site/i, /company\s*url/i, /^url$/i],
      address: [/address/i, /location/i, /headquarters/i, /mailing/i],
      companyHistory: [/history/i, /founded/i, /incorporat/i, /company\s*background/i],
      technologyDescription: [
        /technology\s*description/i,
        /description\s*of\s*(?:your\s*)?technology/i,
        /brief\s*description/i,
        /executive\s*summary/i,
        /product\s*description/i,
        /technology\s*summary/i,
        /describe\s*(?:your\s*)?technology/i,
        /^technology$/i,
      ],
      problemStatement: [/problem/i, /unmet\s*need/i, /clinical\s*need/i],
      proposedSolution: [/solution/i, /offering/i, /value\s*prop/i],
      teamExpertise: [/team\s*expertise/i, /team\s*background/i, /team\s*qualification/i, /key\s*team/i, /^team$/i],
      milestones: [/milestone/i, /stage/i, /current\s*stage/i, /development\s*stage/i],
      funding: [/funding/i, /capital/i, /investment/i, /grants/i],
      headcount: [/headcount/i, /team\s*size/i, /number\s*of\s*employees/i, /employees/i, /ftes/i],
      accCollaboration: [/acc\s*student/i, /student\s*collab/i, /intern/i, /student\s*engage/i, /work\s*with\s*students/i],
      spaceRequirements: [/space\s*require/i, /space\s*need/i, /wet\s*lab\s*need/i, /bench/i, /equipment\s*need/i],
      domain: [/domain/i, /industry/i, /sector/i, /focus\s*area/i, /therapeutic\s*area/i],
      submittedAt: [/timestamp/i, /date\s*submitted/i, /submission\s*date/i, /^date$/i],
    };

    // Find best column index for each field
    const fieldToIndex: Record<string, number> = {};

    headers.forEach((header, colIndex) => {
      if (!header) return;
      let matched = false;

      for (const [field, patterns] of Object.entries(headerMatchMap)) {
        if (fieldToIndex[field] === undefined) {
          const isMatch = patterns.some((p) => p.test(header));
          if (isMatch) {
            fieldToIndex[field] = colIndex;
            mappings.push({
              originalHeader: header,
              normalizedHeader: normalizeString(header),
              mappedField: field,
            });
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        unmapped.push(header);
      }
    });

    setColumnMappings(mappings);
    setUnmappedHeaders(unmapped);

    // Validate that company name was found
    if (fieldToIndex.companyName === undefined) {
      setErrorMessage(
        'Could not automatically identify the "Company Name" column. Please check that this worksheet contains applicant company names.'
      );
    } else {
      setErrorMessage(null);
    }

    // Parse records from row 1 onwards
    const existingCompanyNames = new Set(companies.map((c) => normalizeString(c.name)));

    const candidates: ParsedCandidate[] = [];

    for (let rowIndex = 1; rowIndex < rawData.length; rowIndex++) {
      const row = rawData[rowIndex] || [];

      // If entire row is blank, skip
      const hasAnyValue = row.some((val: any) => String(val || '').trim() !== '');
      if (!hasAnyValue) continue;

      const rawRowDict: Record<string, string> = {};
      headers.forEach((h, idx) => {
        if (h) {
          rawRowDict[h] = String(row[idx] || '').trim();
        }
      });

      const getVal = (field: string): string => {
        const idx = fieldToIndex[field];
        if (idx !== undefined && row[idx] !== undefined) {
          return String(row[idx] || '').trim();
        }
        return '';
      };

      const companyName = getVal('companyName');

      // Check if missing required identifier
      if (!companyName) {
        candidates.push({
          tempId: `row_${rowIndex}`,
          selected: false,
          companyName: `(Row ${rowIndex + 1} - Missing Name)`,
          contactName: getVal('contactName'),
          email: getVal('email'),
          phone: getVal('phone'),
          website: getVal('website'),
          address: getVal('address'),
          domain: getVal('domain') || 'Biotechnology',
          technologyDescription: getVal('technologyDescription'),
          problemStatement: getVal('problemStatement'),
          proposedSolution: getVal('proposedSolution'),
          companyHistory: getVal('companyHistory'),
          teamExpertise: getVal('teamExpertise'),
          milestones: getVal('milestones'),
          funding: getVal('funding'),
          headcount: getVal('headcount'),
          accCollaboration: getVal('accCollaboration'),
          spaceRequirements: getVal('spaceRequirements'),
          submittedAt: getVal('submittedAt') || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          rawRow: rawRowDict,
          isDuplicate: false,
          duplicateAction: 'skip',
          isSkipped: true,
          skipReason: 'Missing company name or identifier',
        });
        continue;
      }

      // Check if duplicate of an existing company
      const normalizedName = normalizeString(companyName);
      const matchingExisting = companies.find((c) => normalizeString(c.name) === normalizedName);
      const isDuplicate = Boolean(matchingExisting);

      candidates.push({
        tempId: `row_${rowIndex}`,
        selected: !isDuplicate, // auto-select new records; duplicates require explicit decision
        companyName,
        contactName: getVal('contactName'),
        email: getVal('email'),
        phone: getVal('phone'),
        website: getVal('website'),
        address: getVal('address'),
        domain: getVal('domain') || 'Biotechnology / Life Sciences',
        technologyDescription: getVal('technologyDescription'),
        problemStatement: getVal('problemStatement'),
        proposedSolution: getVal('proposedSolution'),
        companyHistory: getVal('companyHistory'),
        teamExpertise: getVal('teamExpertise'),
        milestones: getVal('milestones'),
        funding: getVal('funding'),
        headcount: getVal('headcount'),
        accCollaboration: getVal('accCollaboration'),
        spaceRequirements: getVal('spaceRequirements'),
        submittedAt: getVal('submittedAt') || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rawRow: rawRowDict,
        isDuplicate,
        duplicateOf: matchingExisting?.name,
        duplicateId: matchingExisting?.id,
        duplicateAction: isDuplicate ? 'new' : 'new',
        isSkipped: false,
      });
    }

    setParsedCandidates(candidates);
  };

  const handleSheetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSheet = e.target.value;
    setSelectedSheet(newSheet);
    if (workbook) {
      parseWorksheet(workbook, newSheet);
    }
  };

  const toggleSelectCandidate = (tempId: string) => {
    setParsedCandidates((prev) =>
      prev.map((c) => (c.tempId === tempId ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleDuplicateActionChange = (tempId: string, action: 'new' | 'update' | 'skip') => {
    setParsedCandidates((prev) =>
      prev.map((c) =>
        c.tempId === tempId
          ? {
              ...c,
              duplicateAction: action,
              selected: action !== 'skip',
            }
          : c
      )
    );
  };

  const handleSelectAll = (select: boolean) => {
    setParsedCandidates((prev) =>
      prev.map((c) => (c.isSkipped ? c : { ...c, selected: select }))
    );
  };

  // Execute the import
  const handleConfirmImport = () => {
    const toImport = parsedCandidates.filter((c) => c.selected && !c.isSkipped);

    if (toImport.length === 0) {
      triggerToast('No Records Selected', 'Please select at least one application to import.', 'warning');
      return;
    }

    const importedCompanies: CompanyAssessment[] = [];

    toImport.forEach((candidate, idx) => {
      // Determine if updating an existing record or creating a new one
      const isUpdating = candidate.isDuplicate && candidate.duplicateAction === 'update' && candidate.duplicateId;
      const targetId = isUpdating ? candidate.duplicateId! : `comp_import_${Date.now()}_${idx}`;

      // Build contact details
      const contactDetails: OrganizationContactDetails = {
        primaryContactName: candidate.contactName || 'Not provided',
        roleOrTitle: 'Not provided',
        email: candidate.email || 'Not provided',
        phone: candidate.phone || 'Not provided',
        website: candidate.website || 'Not provided',
        linkedIn: 'Not provided',
        mailingAddress: candidate.address || 'Not provided',
      };

      // Build application info with all raw columns preserved
      const applicationInfo: ApplicationIntakeInfo = {
        submittedAt: candidate.submittedAt || 'Not provided',
        executiveSummary: candidate.technologyDescription || 'Not provided',
        problemStatement: candidate.problemStatement || 'Not provided',
        proposedSolution: candidate.proposedSolution || 'Not provided',
        stageOfDevelopment: candidate.milestones || 'Not provided',
        targetMarket: 'Not provided',
        teamBackground: candidate.teamExpertise || 'Not provided',
        fundingRaisedToDate: candidate.funding || 'Not provided',
        spaceRequirements: candidate.spaceRequirements || 'Not provided',
        additionalFields: {
          ...candidate.rawRow,
          ...(candidate.headcount ? { Headcount: candidate.headcount } : {}),
          ...(candidate.accCollaboration ? { 'ACC Student Collaboration': candidate.accCollaboration } : {}),
          ...(candidate.companyHistory ? { 'Company History': candidate.companyHistory } : {}),
        },
      };

      // Build initial meeting record for pitch
      const pitchMeeting: MeetingRecord = {
        id: `${targetId}_pitch`,
        organizationId: targetId,
        type: 'Initial Pitch',
        title: `${candidate.companyName} - Initial Intake Pitch`,
        date: candidate.submittedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        deckTitle: `${candidate.companyName} Intake Deck.pdf`,
        deckSlideCount: 10,
        reviewers: [],
        feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
        status: 'Scheduled',
      };

      const newCompany: CompanyAssessment = {
        id: targetId,
        name: candidate.companyName,
        round: 'Initial Intake',
        cohort: 'Cohort 2026',
        reviewDate: candidate.submittedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        domain: candidate.domain || 'Biotechnology / Life Sciences',
        admissionStatus: 'Pending',
        thresholdScore: 3.5,
        contactDetails,
        applicationInfo,
        contractDetails: DEFAULT_CONTRACT_DETAILS,
        contractDocuments: [],
        meetings: [pitchMeeting],
      };

      importedCompanies.push(newCompany);
    });

    importCompanies(importedCompanies);
    setIsImportModalOpen(false);
  };

  // Stats
  const totalFound = parsedCandidates.length;
  const validCount = parsedCandidates.filter((c) => !c.isSkipped && !c.isDuplicate).length;
  const duplicateCount = parsedCandidates.filter((c) => c.isDuplicate).length;
  const skippedCount = parsedCandidates.filter((c) => c.isSkipped).length;
  const selectedCount = parsedCandidates.filter((c) => c.selected && !c.isSkipped).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <AbiLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#1E293B] tracking-tight">
                  Import Applications from Local Workbook
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F2F9EC] text-[#431A4D] border border-[#78BE20]/40">
                  Local Ingestion
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Load real applicant records from the confidential ABI Form to Lead Responses (.xlsx)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsImportModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close import dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* File Upload / Drag-and-Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-[#78BE20] bg-[#F2F9EC]'
                : fileName
                ? 'border-slate-300 bg-slate-50/70 hover:bg-slate-100'
                : 'border-slate-300 hover:border-[#78BE20] bg-slate-50 hover:bg-[#F2F9EC]/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-[#431A4D]">
              <FileSpreadsheet className="w-6 h-6 text-[#78BE20]" />
            </div>

            <div>
              <div className="text-sm font-bold text-slate-800">
                {fileName ? (
                  <span className="text-[#431A4D] font-extrabold flex items-center gap-1.5 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#78BE20]" />
                    {fileName}
                  </span>
                ) : (
                  'Drag and drop the ABI Form to Lead Responses .xlsx here'
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {fileName
                  ? 'Click or drag another file to replace'
                  : 'Or click to browse and select the Excel workbook from your computer'}
              </p>
            </div>

            {/* Confidentiality Guarantee */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Confidential Local Processing — Parsed purely in-browser. Zero data leaves this computer.</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Import Warning:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Worksheet Controls & Summary Stats */}
          {workbook && sheetNames.length > 0 && (
            <div className="space-y-4 pt-1">
              {/* Sheet Chooser & Record Counts */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <label htmlFor="sheet-select" className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
                    Worksheet:
                  </label>
                  <select
                    id="sheet-select"
                    value={selectedSheet}
                    onChange={handleSheetChange}
                    className="text-xs font-bold text-[#431A4D] bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                  >
                    {sheetNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    Found: <strong className="text-slate-900">{totalFound}</strong>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                    Ready: <strong>{validCount}</strong>
                  </span>
                  {duplicateCount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800" title="Companies matching existing records in system. Not auto-merged.">
                      Possible Duplicates: <strong>{duplicateCount}</strong>
                    </span>
                  )}
                  {skippedCount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500" title="Rows missing company name or identifier">
                      Skipped: <strong>{skippedCount}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Detected Columns Accordion / Dropdown */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setShowDetectedColumns(!showDetectedColumns)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#78BE20]" />
                    <span>
                      Detected Columns: {columnMappings.length} mapped · {unmappedHeaders.length} preserved raw
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      showDetectedColumns ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showDetectedColumns && (
                  <div className="p-4 border-t border-slate-200 text-xs space-y-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Mapped Core Fields:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {columnMappings.map((m) => (
                          <span
                            key={m.mappedField}
                            className="px-2 py-1 rounded-md bg-[#F2F9EC] text-[#431A4D] border border-[#78BE20]/30 font-medium"
                          >
                            <strong>{m.mappedField}</strong> ← <span className="text-slate-600 font-mono">"{m.originalHeader}"</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {unmappedHeaders.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Preserved Additional Intake Columns (Zero Data Lost):
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {unmappedHeaders.map((hdr) => (
                            <span
                              key={hdr}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]"
                            >
                              "{hdr}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Small Preview Table */}
              {parsedCandidates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                    <span>Preview Applications ({parsedCandidates.length} records):</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectAll(true)}
                        className="text-[#431A4D] hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(false)}
                        className="text-slate-500 hover:underline cursor-pointer"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs max-h-64 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 sticky top-0 z-10 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">Import</th>
                          <th className="py-2.5 px-3">Company Name</th>
                          <th className="py-2.5 px-3">Primary Contact</th>
                          <th className="py-2.5 px-3">Technology Summary</th>
                          <th className="py-2.5 px-3">Funding & Size</th>
                          <th className="py-2.5 px-3">Duplicate Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {parsedCandidates.map((c) => (
                          <tr
                            key={c.tempId}
                            className={`transition-colors ${
                              c.isSkipped
                                ? 'bg-slate-50/80 text-slate-400'
                                : c.isDuplicate
                                ? 'bg-amber-50/40 hover:bg-amber-50/70'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={c.selected}
                                disabled={c.isSkipped}
                                onChange={() => toggleSelectCandidate(c.tempId)}
                                className="rounded text-[#431A4D] focus:ring-[#78BE20] cursor-pointer"
                              />
                            </td>

                            {/* Company Name */}
                            <td className="py-2 px-3">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#431A4D] shrink-0" />
                                <span className="truncate max-w-[140px]">{c.companyName}</span>
                              </div>
                              {c.isDuplicate && (
                                <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mt-0.5">
                                  Matches: {c.duplicateOf}
                                </span>
                              )}
                              {c.isSkipped && (
                                <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded mt-0.5">
                                  {c.skipReason}
                                </span>
                              )}
                            </td>

                            {/* Primary Contact */}
                            <td className="py-2 px-3">
                              <div className="text-slate-800 font-semibold">{c.contactName || 'Not provided'}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                                {c.email || c.phone || 'No direct contact'}
                              </div>
                            </td>

                            {/* Technology / Executive Summary */}
                            <td className="py-2 px-3">
                              <div
                                className="text-slate-700 text-[11px] line-clamp-2 max-w-[220px]"
                                title={c.technologyDescription}
                              >
                                {c.technologyDescription || c.domain || 'Not provided'}
                              </div>
                            </td>

                            {/* Funding & Headcount */}
                            <td className="py-2 px-3 text-[11px]">
                              <div className="font-semibold text-slate-800">{c.funding || 'Pre-seed'}</div>
                              <div className="text-slate-500">
                                {c.headcount ? `${c.headcount} team` : 'Headcount unlisted'}
                              </div>
                            </td>

                            {/* Duplicate Decision Action */}
                            <td className="py-2 px-3">
                              {c.isDuplicate ? (
                                <select
                                  value={c.duplicateAction}
                                  onChange={(e) =>
                                    handleDuplicateActionChange(
                                      c.tempId,
                                      e.target.value as 'new' | 'update' | 'skip'
                                    )
                                  }
                                  className="text-[11px] font-bold border border-amber-300 rounded px-1.5 py-1 bg-white text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                >
                                  <option value="new">Import as New</option>
                                  <option value="update">Update Existing</option>
                                  <option value="skip">Skip</option>
                                </select>
                              ) : (
                                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  New Entry
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Confirmation Bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            {selectedCount > 0 ? (
              <span>
                <strong className="text-slate-900 font-extrabold">{selectedCount}</strong> application
                {selectedCount > 1 ? 's' : ''} selected for local import.
              </span>
            ) : (
              <span>Select at least one application to import.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleConfirmImport}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedCount > 0
                  ? 'bg-[#431A4D] hover:bg-[#32133a] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4 text-[#78BE20]" />
              <span>Confirm & Import ({selectedCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
