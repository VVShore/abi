import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  RatingValue,
  QuestionCriterion,
  ReviewerScoreRecord,
  CompanyAssessment,
  SectionHeaderConfig,
  RecommendationDecision,
  OrganizationContractDetails,
  OrganizationContactDetails,
  ApplicationIntakeInfo,
  ContractDocument,
  ContractDocumentType,
  MeetingRecord,
  FeedbackSectionData,
} from '../types';
import {
  INITIAL_COMPANIES,
  INITIAL_COMPANY,
  QUESTIONS_DATA,
  INITIAL_REVIEWERS,
  DEFAULT_FEEDBACK_SECTIONS,
  DEFAULT_CONTRACT_DETAILS,
  DEFAULT_CONTACT_DETAILS,
  DEFAULT_APPLICATION_INFO,
} from '../data/mockData';

export type ScreenType = 'individual' | 'committee' | 'report';

export const DEFAULT_SECTION_HEADERS: Record<'team' | 'market' | 'fit' | 'risk', SectionHeaderConfig> = {
  team: {
    title: 'Team',
    prompt: 'If given the opportunity to mentor or work with this company, I definitely would.',
    statement: 'Team: If given the opportunity to mentor or work with this company, I definitely would.',
    notesHeader: 'Team Notes',
  },
  market: {
    title: 'Value Proposition',
    prompt: 'If I were a target customer, I would buy this product or service.',
    statement: 'Value Proposition: If I were a target customer, I would buy this product or service.',
    notesHeader: 'Value Prop Notes',
  },
  fit: {
    title: 'ABI Fit',
    prompt: 'I believe ABI has the appropriate resources and should help this company.',
    statement: 'ABI Fit: I believe ABI has the appropriate resources and should help this company.',
    notesHeader: 'ABI Fit Notes',
  },
  risk: {
    title: 'Risk',
    prompt: 'I would invest my own money in this company.',
    statement: 'Risk: I would invest my own money in this company.',
    notesHeader: 'Risk Notes',
  },
};

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface EvaluationContextType {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  activeReviewerId: string;
  setActiveReviewerId: (id: string) => void;
  currentReviewer: ReviewerScoreRecord;
  reviewers: ReviewerScoreRecord[];
  addNewReviewer: (name: string, title?: string, role?: string) => string;

  // Organization / Company management
  companies: CompanyAssessment[];
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  company: CompanyAssessment;
  updateCompany: (updates: Partial<CompanyAssessment>) => void;
  addNewCompany: (companyData?: Partial<CompanyAssessment>) => string;
  deleteCompany: (companyId: string) => void;
  isCompanyModalOpen: boolean;
  setIsCompanyModalOpen: (open: boolean) => void;

  // Meeting management (belongs to active organization)
  activeMeetingId: string;
  setActiveMeetingId: (id: string) => void;
  activeMeeting: MeetingRecord | undefined;
  meetings: MeetingRecord[];
  addProgressCheckin: (date: string, title?: string) => string;
  createInitialPitch: (date?: string, title?: string) => string;
  updateMeetingFeedback: (meetingId: string, feedbackSections: FeedbackSectionData[]) => void;

  // Contract Details & Documents (belongs to active organization)
  contractDetails: OrganizationContractDetails;
  updateContractDetails: (updates: Partial<OrganizationContractDetails>) => void;
  contractDocuments: ContractDocument[];
  addContractDocument: (doc: {
    title: string;
    documentType: ContractDocumentType;
    fileSize?: string;
    fileType?: string;
    uploadedDuringMeetingId?: string;
  }) => string;

  // Contact & Application Info (belongs to active organization)
  contactDetails: OrganizationContactDetails;
  updateContactDetails: (updates: Partial<OrganizationContactDetails>) => void;
  applicationInfo: ApplicationIntakeInfo;
  updateApplicationInfo: (updates: Partial<ApplicationIntakeInfo>) => void;

  // Criteria & Scoring
  questions: QuestionCriterion[];
  sectionHeaders: Record<'team' | 'market' | 'fit' | 'risk', SectionHeaderConfig>;
  updateSectionHeader: (category: 'team' | 'market' | 'fit' | 'risk', updates: Partial<SectionHeaderConfig>) => void;
  addCriterion: (category: 'team' | 'market' | 'fit' | 'risk', criteriaName: string, prompt: string) => void;
  deleteCriterion: (criterionId: string) => void;
  setScore: (questionId: string, rating: RatingValue | undefined) => void;
  setQuestionNote: (questionId: string, noteText: string) => void;
  updateCriteriaDefinition: (questionId: string, updates: Partial<QuestionCriterion>) => void;
  clearScorecard: () => void;
  currentCategoryAverages: {
    team: number;
    market: number;
    fit: number;
    risk: number;
  };
  currentOverallAverage: number;
  allQuestionsAnswered: boolean;

  // Reviewer details
  updateReviewerInfo: (name: string, title?: string, role?: string) => void;
  updateReviewerSummary: (strengths: string, support: string) => void;
  setCategoryRating: (categoryKey: string, rating: number) => void;
  setRecommendation: (recommendation: RecommendationDecision) => void;
  setOverallSummary: (summary: string) => void;
  setSectionComment: (categoryKey: string, comment: string) => void;

  // Committee matrix calculations
  committeeMatrix: {
    reviewerRows: {
      reviewer: ReviewerScoreRecord;
      teamAvg: number;
      marketAvg: number;
      fitAvg: number;
      riskAvg: number;
      overallAvg: number;
    }[];
    categoryAverages: {
      team: number;
      market: number;
      fit: number;
      risk: number;
      total: number;
    };
  };

  // Actions
  saveProgress: () => void;
  submitScorecard: () => void;
  reopenScorecard: () => void;
  approveCommitteeReview: () => void;
  resetToDefaults: () => void;

  // UI Modals & Toasts
  toast: ToastState | null;
  triggerToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  isWorkspaceModalOpen: boolean;
  setIsWorkspaceModalOpen: (open: boolean) => void;
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (open: boolean) => void;
  isPitchDeckModalOpen: boolean;
  setIsPitchDeckModalOpen: (open: boolean) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  importCompanies: (imported: CompanyAssessment[]) => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPANIES: 'abi_companies_v4',
  ACTIVE_COMPANY: 'abi_active_company_id_v4',
  ACTIVE_MEETING: 'abi_active_meeting_id_v4',
  EVALUATIONS: 'abi_evaluations_by_company_v4',
  QUESTIONS: 'abi_questions_v4',
  SECTION_HEADERS: 'abi_section_headers_v4',
};

const createBlankReviewerSet = (): ReviewerScoreRecord[] => {
  return INITIAL_REVIEWERS.map((r) => ({
    ...r,
    scores: {},
    notes: {},
    categoryRatings: {},
    sectionComments: {},
    recommendation: undefined,
    overallSummary: '',
    keyStrengths: '',
    supportNeeded: '',
    isSubmitted: false,
    submittedAt: undefined,
    lastSavedAt: undefined,
  }));
};

/**
 * Idempotent, safe migration helper:
 * - Preserves existing stored records.
 * - Migrates existing evaluation data only when its meeting association is clear.
 * - Never silently assigns ambiguous historical records to a new meeting.
 * - Safe to run more than once.
 * - Does not store file binaries in localStorage.
 */
const migrateCompanyRecord = (
  comp: CompanyAssessment,
  savedEvaluations: Record<string, ReviewerScoreRecord[]>
): CompanyAssessment => {
  // 1. Contract details (default missing fields to "Not provided")
  const contractDetails: OrganizationContractDetails = comp.contractDetails || {
    ...DEFAULT_CONTRACT_DETAILS,
  };

  // 2. Contact details (default missing fields to "Not provided")
  const contactDetails: OrganizationContactDetails = comp.contactDetails || {
    ...DEFAULT_CONTACT_DETAILS,
  };

  // 3. Application / Intake info (default missing fields to "Not provided")
  const applicationInfo: ApplicationIntakeInfo = comp.applicationInfo || {
    ...DEFAULT_APPLICATION_INFO,
  };

  // 4. Contract documents (metadata only, zero file binaries)
  const contractDocuments: ContractDocument[] = Array.isArray(comp.contractDocuments)
    ? comp.contractDocuments
    : [];

  // 5. Meetings migration: if already populated, keep intact
  let meetings: MeetingRecord[] = [];
  if (Array.isArray(comp.meetings) && comp.meetings.length > 0) {
    meetings = comp.meetings;
  } else {
    // Check if there is an unambiguous historical evaluation record for this company
    const historicalEvals = savedEvaluations[comp.id];
    const initialPitchMeeting: MeetingRecord = {
      id: `${comp.id}_pitch`,
      organizationId: comp.id,
      type: 'Initial Pitch',
      title: `${comp.name} - Initial Pitch Evaluation`,
      date: comp.reviewDate || 'Jan 23, 2026',
      deckTitle: `${comp.name} Pitch Deck.pdf`,
      deckSlideCount: 12,
      reviewers:
        historicalEvals && Array.isArray(historicalEvals) && historicalEvals.length > 0
          ? historicalEvals
          : createBlankReviewerSet(),
      feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
      status: comp.admissionStatus === 'Approved' ? 'Completed' : 'In Progress',
    };
    meetings = [initialPitchMeeting];
  }

  return {
    ...comp,
    contractDetails,
    contactDetails,
    applicationInfo,
    contractDocuments,
    meetings,
  };
};

export const EvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('individual');
  const [activeReviewerId, setActiveReviewerId] = useState<string>('nl');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Raw evaluations map from local storage (for legacy reads and fallback)
  const [evaluationsByCompany, setEvaluationsByCompany] = useState<Record<string, ReviewerScoreRecord[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return {
      vayim: INITIAL_REVIEWERS,
    };
  });

  // Companies / Organizations state (hydrated with idempotent migration)
  const [companies, setCompanies] = useState<CompanyAssessment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => migrateCompanyRecord(c, evaluationsByCompany));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_COMPANIES.map((c) => migrateCompanyRecord(c, evaluationsByCompany));
  });

  const [activeCompanyId, setActiveCompanyId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_COMPANY);
      if (saved && companies.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return companies[0]?.id || 'vayim';
  });

  // Active Company
  const company = useMemo(() => {
    return companies.find((c) => c.id === activeCompanyId) || companies[0] || INITIAL_COMPANY;
  }, [companies, activeCompanyId]);

  // Active Meeting ID
  const [activeMeetingId, setActiveMeetingId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_MEETING);
      const activeComp = companies.find((c) => c.id === activeCompanyId) || companies[0];
      if (saved && activeComp?.meetings?.some((m) => m.id === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    const initialMeeting = (companies.find((c) => c.id === activeCompanyId) || companies[0])?.meetings?.[0];
    return initialMeeting?.id || `${activeCompanyId}_pitch`;
  });

  // Ensure activeMeetingId points to a valid meeting of the active company when company changes
  useEffect(() => {
    if (company.meetings && company.meetings.length > 0) {
      const exists = company.meetings.some((m) => m.id === activeMeetingId);
      if (!exists) {
        setActiveMeetingId(company.meetings[0].id);
      }
    }
  }, [company.id, company.meetings, activeMeetingId]);

  // Questions definition state
  const [questions, setQuestions] = useState<QuestionCriterion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return QUESTIONS_DATA;
  });

  // Section headers state
  const [sectionHeaders, setSectionHeaders] = useState<Record<'team' | 'market' | 'fit' | 'risk', SectionHeaderConfig>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTION_HEADERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            team: {
              ...DEFAULT_SECTION_HEADERS.team,
              ...(parsed.team || {}),
              title: parsed.team?.title || DEFAULT_SECTION_HEADERS.team.title,
              prompt: parsed.team?.prompt || DEFAULT_SECTION_HEADERS.team.prompt,
            },
            market: {
              ...DEFAULT_SECTION_HEADERS.market,
              ...(parsed.market || {}),
              title: parsed.market?.title || DEFAULT_SECTION_HEADERS.market.title,
              prompt: parsed.market?.prompt || DEFAULT_SECTION_HEADERS.market.prompt,
            },
            fit: {
              ...DEFAULT_SECTION_HEADERS.fit,
              ...(parsed.fit || {}),
              title: parsed.fit?.title || DEFAULT_SECTION_HEADERS.fit.title,
              prompt: parsed.fit?.prompt || DEFAULT_SECTION_HEADERS.fit.prompt,
            },
            risk: {
              ...DEFAULT_SECTION_HEADERS.risk,
              ...(parsed.risk || {}),
              title: parsed.risk?.title || DEFAULT_SECTION_HEADERS.risk.title,
              prompt: parsed.risk?.prompt || DEFAULT_SECTION_HEADERS.risk.prompt,
            },
          };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_SECTION_HEADERS;
  });

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Sync state to local storage (metadata only, zero file binaries)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY, activeCompanyId);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_MEETING, activeMeetingId);
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluationsByCompany));
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      localStorage.setItem(STORAGE_KEYS.SECTION_HEADERS, JSON.stringify(sectionHeaders));
    } catch {
      // ignore
    }
  }, [companies, activeCompanyId, activeMeetingId, evaluationsByCompany, questions, sectionHeaders]);

  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Active Meeting
  const activeMeeting = useMemo(() => {
    if (!company.meetings || company.meetings.length === 0) {
      return undefined;
    }
    return company.meetings.find((m) => m.id === activeMeetingId) || company.meetings[0];
  }, [company, activeMeetingId]);

  // Meetings for the active company
  const meetings = useMemo(() => {
    return company.meetings || [];
  }, [company]);

  // Reviewers for the currently active meeting (falls back to legacy company map if needed)
  const reviewers = useMemo(() => {
    return activeMeeting?.reviewers || evaluationsByCompany[activeCompanyId] || INITIAL_REVIEWERS;
  }, [activeMeeting, evaluationsByCompany, activeCompanyId]);

  const currentReviewer = useMemo(() => {
    return reviewers.find((r) => r.id === activeReviewerId) || reviewers[0];
  }, [reviewers, activeReviewerId]);

  // Contract Details & Documents (belonging to active organization)
  const contractDetails = useMemo(() => {
    return company.contractDetails || DEFAULT_CONTRACT_DETAILS;
  }, [company]);

  const contractDocuments = useMemo(() => {
    return company.contractDocuments || [];
  }, [company]);

  const contactDetails = useMemo(() => {
    return company.contactDetails || DEFAULT_CONTACT_DETAILS;
  }, [company]);

  const applicationInfo = useMemo(() => {
    return company.applicationInfo || DEFAULT_APPLICATION_INFO;
  }, [company]);

  // Helper to update active meeting's reviewers while keeping legacy evaluationsByCompany in sync
  const updateActiveMeetingReviewers = (
    updater: (prevReviewers: ReviewerScoreRecord[]) => ReviewerScoreRecord[]
  ) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((c) => {
        if (c.id === activeCompanyId) {
          const targetMeetingId = activeMeeting?.id || c.meetings?.[0]?.id;
          const updatedMeetings = (c.meetings || []).map((m) => {
            if (m.id === targetMeetingId) {
              return { ...m, reviewers: updater(m.reviewers || INITIAL_REVIEWERS) };
            }
            return m;
          });
          return { ...c, meetings: updatedMeetings };
        }
        return c;
      })
    );

    // If on initial pitch, also update evaluationsByCompany for backwards compatibility
    if (!activeMeeting || activeMeeting.type === 'Initial Pitch') {
      setEvaluationsByCompany((prev) => {
        const currentList = prev[activeCompanyId] || reviewers;
        return {
          ...prev,
          [activeCompanyId]: updater(currentList),
        };
      });
    }
  };

  // Company management actions
  const updateCompany = (updates: Partial<CompanyAssessment>) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return { ...c, ...updates };
        }
        return c;
      })
    );
    triggerToast('Company Updated', `Updated details for ${updates.name || company.name}.`);
  };

  const addNewCompany = (companyData?: Partial<CompanyAssessment>): string => {
    const newId = `company_${Date.now()}`;
    const initialMeetingId = `${newId}_pitch`;
    const reviewDate =
      companyData?.reviewDate ||
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const initialMeeting: MeetingRecord = {
      id: initialMeetingId,
      organizationId: newId,
      type: 'Initial Pitch',
      title: `${companyData?.name?.trim() || 'New Bioscience Applicant'} - Initial Pitch Evaluation`,
      date: reviewDate,
      deckTitle: 'Initial Pitch Deck.pdf',
      deckSlideCount: 12,
      reviewers: createBlankReviewerSet(),
      feedbackSummary: DEFAULT_FEEDBACK_SECTIONS.map((sec) => ({
        ...sec,
        summary: '',
        quotes: [],
      })),
      status: 'In Progress',
    };

    const newComp: CompanyAssessment = {
      id: newId,
      name: companyData?.name?.trim() || 'New Bioscience Applicant',
      round: companyData?.round || 'Round 1 Evaluation',
      cohort: companyData?.cohort || 'Cohort 2026.1 Assessment',
      reviewDate,
      domain: companyData?.domain || 'Biotechnology / Therapeutics',
      admissionStatus: companyData?.admissionStatus || 'Pending',
      thresholdScore: companyData?.thresholdScore || 3.5,
      contactDetails: DEFAULT_CONTACT_DETAILS,
      applicationInfo: DEFAULT_APPLICATION_INFO,
      contractDetails: DEFAULT_CONTRACT_DETAILS,
      contractDocuments: [],
      meetings: [initialMeeting],
    };

    setCompanies((prev) => [...prev, newComp]);
    setEvaluationsByCompany((prev) => ({
      ...prev,
      [newId]: createBlankReviewerSet(),
    }));
    setActiveCompanyId(newId);
    setActiveMeetingId(initialMeetingId);
    triggerToast('Company Created', `Added ${newComp.name}. Scorecard is ready for evaluation!`);
    return newId;
  };

  const deleteCompany = (companyId: string) => {
    if (companies.length <= 1) {
      triggerToast('Cannot Delete', 'At least one company profile must remain.', 'warning');
      return;
    }
    const remaining = companies.filter((c) => c.id !== companyId);
    setCompanies(remaining);
    if (activeCompanyId === companyId) {
      setActiveCompanyId(remaining[0].id);
      setActiveMeetingId(remaining[0].meetings?.[0]?.id || `${remaining[0].id}_pitch`);
    }
    setEvaluationsByCompany((prev) => {
      const next = { ...prev };
      delete next[companyId];
      return next;
    });
    triggerToast('Company Removed', 'The company evaluation has been deleted.');
  };

  const importCompanies = (importedList: CompanyAssessment[]) => {
    if (!importedList || importedList.length === 0) return;

    setCompanies((prev) => {
      const existingMap = new Map(prev.map((c) => [c.id, c]));

      importedList.forEach((incoming) => {
        const existing = existingMap.get(incoming.id);

        if (existing) {
          // Re-importing into an existing company:
          // CRITICAL: DO NOT overwrite existing user-edited company details,
          // contracts, documents, or evaluation records.
          const merged: CompanyAssessment = {
            ...existing, // preserve existing identity, admissionStatus, thresholdScore
            name: existing.name || incoming.name,
            domain:
              existing.domain && existing.domain !== 'Biotechnology'
                ? existing.domain
                : incoming.domain || existing.domain,
            // Update intake application info while preserving existing additional fields
            applicationInfo: (() => {
              const prevInfo = existing.applicationInfo || DEFAULT_APPLICATION_INFO;
              const nextInfo = incoming.applicationInfo || DEFAULT_APPLICATION_INFO;
              const keep = (prevVal?: string, nextVal?: string) =>
                prevVal && prevVal.trim() && prevVal !== 'Not provided' ? prevVal : nextVal || 'Not provided';
              const merged = { ...prevInfo };
              (Object.keys(nextInfo) as (keyof ApplicationIntakeInfo)[]).forEach((key) => {
                if (key !== 'additionalFields') {
                  merged[key] = keep(prevInfo[key] as string, nextInfo[key] as string);
                }
              });
              const additionalFields = { ...(prevInfo.additionalFields || {}) };
              Object.entries(nextInfo.additionalFields || {}).forEach(([question, answer]) => {
                additionalFields[question] = keep(additionalFields[question], answer);
              });
              return { ...merged, additionalFields };
            })(),
            // Merge contact details without overwriting user-provided edits
            contactDetails: {
              primaryContactName:
                existing.contactDetails?.primaryContactName &&
                existing.contactDetails.primaryContactName !== 'Not provided'
                  ? existing.contactDetails.primaryContactName
                  : incoming.contactDetails?.primaryContactName || 'Not provided',
              roleOrTitle:
                existing.contactDetails?.roleOrTitle &&
                existing.contactDetails.roleOrTitle !== 'Not provided'
                  ? existing.contactDetails.roleOrTitle
                  : incoming.contactDetails?.roleOrTitle || 'Not provided',
              email:
                existing.contactDetails?.email && existing.contactDetails.email !== 'Not provided'
                  ? existing.contactDetails.email
                  : incoming.contactDetails?.email || 'Not provided',
              phone:
                existing.contactDetails?.phone && existing.contactDetails.phone !== 'Not provided'
                  ? existing.contactDetails.phone
                  : incoming.contactDetails?.phone || 'Not provided',
              website:
                existing.contactDetails?.website && existing.contactDetails.website !== 'Not provided'
                  ? existing.contactDetails.website
                  : incoming.contactDetails?.website || 'Not provided',
              linkedIn:
                existing.contactDetails?.linkedIn && existing.contactDetails.linkedIn !== 'Not provided'
                  ? existing.contactDetails.linkedIn
                  : incoming.contactDetails?.linkedIn || 'Not provided',
              mailingAddress:
                existing.contactDetails?.mailingAddress &&
                existing.contactDetails.mailingAddress !== 'Not provided'
                  ? existing.contactDetails.mailingAddress
                  : incoming.contactDetails?.mailingAddress || 'Not provided',
            },
            // STRICTLY PRESERVE all existing contract details, documents, and meetings/evaluations
            contractDetails: existing.contractDetails || DEFAULT_CONTRACT_DETAILS,
            contractDocuments: existing.contractDocuments || [],
            meetings:
              existing.meetings && existing.meetings.length > 0
                ? existing.meetings
                : incoming.meetings || [],
          };

          existingMap.set(incoming.id, merged);
        } else {
          // Brand new company entry: migrate cleanly, giving empty meetings the standard blank reviewer roster
          const migrated = migrateCompanyRecord(
            {
              ...incoming,
              meetings: (incoming.meetings || []).map((m) =>
                m.reviewers && m.reviewers.length > 0 ? m : { ...m, reviewers: createBlankReviewerSet() }
              ),
            },
            evaluationsByCompany
          );
          existingMap.set(incoming.id, migrated);
        }
      });

      return Array.from(existingMap.values());
    });

    // Update evaluationsByCompany ONLY for brand-new companies; never overwrite existing evaluations
    setEvaluationsByCompany((prev) => {
      const next = { ...prev };
      importedList.forEach((c) => {
        if (!next[c.id]) {
          const pitchMeeting = c.meetings?.find((m) => m.type === 'Initial Pitch');
          next[c.id] =
            pitchMeeting?.reviewers && pitchMeeting.reviewers.length > 0
              ? pitchMeeting.reviewers
              : createBlankReviewerSet();
        }
      });
      return next;
    });

    if (importedList[0]) {
      setActiveCompanyId(importedList[0].id);
      const targetMeetingId = importedList[0].meetings?.[0]?.id || `${importedList[0].id}_pitch`;
      setActiveMeetingId(targetMeetingId);
    }

    triggerToast(
      'Applications Imported',
      `Imported ${importedList.length} company application${importedList.length > 1 ? 's' : ''}. Existing evaluations and contracts preserved.`,
      'success'
    );
  };

  // Meeting management actions
  const createInitialPitch = (date?: string, title?: string): string => {
    const pitchId = `${activeCompanyId}_pitch`;
    const pitchDate =
      date?.trim() ||
      company.reviewDate ||
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newMeeting: MeetingRecord = {
      id: pitchId,
      organizationId: activeCompanyId,
      type: 'Initial Pitch',
      title: title?.trim() || `${company.name} - Initial Pitch Evaluation`,
      date: pitchDate,
      deckTitle: `${company.name} Pitch Deck.pdf`,
      deckSlideCount: 12,
      reviewers: createBlankReviewerSet(),
      feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
      status: 'In Progress',
    };

    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            meetings: [newMeeting, ...(c.meetings || [])],
          };
        }
        return c;
      })
    );

    setActiveMeetingId(pitchId);
    triggerToast('Initial Pitch Created', `Created Initial Pitch meeting for ${company.name}.`);
    return pitchId;
  };

  const addProgressCheckin = (date: string, title?: string): string => {
    const newId = `${activeCompanyId}_checkin_${Date.now()}`;
    const newMeeting: MeetingRecord = {
      id: newId,
      organizationId: activeCompanyId,
      type: 'Progress Check-in',
      title: title?.trim() || `Progress Check-in (${date.trim()})`,
      date: date.trim(),
      deckTitle: `${company.name} Progress Check-in Deck.pdf`,
      deckSlideCount: 8,
      reviewers: createBlankReviewerSet(),
      feedbackSummary: DEFAULT_FEEDBACK_SECTIONS.map((sec) => ({
        ...sec,
        summary: '',
        quotes: [],
      })),
      status: 'In Progress',
    };

    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            meetings: [...(c.meetings || []), newMeeting],
          };
        }
        return c;
      })
    );

    setActiveMeetingId(newId);
    triggerToast('Progress Check-in Added', `Scheduled check-in on ${date}. Meeting has access to company contract.`);
    return newId;
  };

  const updateMeetingFeedback = (meetingId: string, feedbackSections: FeedbackSectionData[]) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            meetings: (c.meetings || []).map((m) => {
              if (m.id === meetingId) {
                return { ...m, feedbackSummary: feedbackSections };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  };

  // Contract Details & Documents actions
  const updateContractDetails = (updates: Partial<OrganizationContractDetails>) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            contractDetails: {
              ...(c.contractDetails || DEFAULT_CONTRACT_DETAILS),
              ...updates,
            },
          };
        }
        return c;
      })
    );
    triggerToast('Contract Terms Updated', 'Organization contract and facility space terms saved.');
  };

  const addContractDocument = (doc: {
    title: string;
    documentType: ContractDocumentType;
    fileSize?: string;
    fileType?: string;
    uploadedDuringMeetingId?: string;
  }): string => {
    const newDocId = `doc_${Date.now()}`;
    const newDoc: ContractDocument = {
      id: newDocId,
      organizationId: activeCompanyId,
      title: doc.title.trim(),
      documentType: doc.documentType,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      fileSize: doc.fileSize || '1.2 MB',
      fileType: doc.fileType || 'application/pdf',
      uploadedDuringMeetingId: doc.uploadedDuringMeetingId || activeMeetingId,
    };

    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            contractDocuments: [...(c.contractDocuments || []), newDoc],
          };
        }
        return c;
      })
    );

    triggerToast('Document Attached', `Added "${newDoc.title}" to ${company.name} records.`);
    return newDocId;
  };

  // Contact Details & Application Info actions
  const updateContactDetails = (updates: Partial<OrganizationContactDetails>) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            contactDetails: {
              ...(c.contactDetails || DEFAULT_CONTACT_DETAILS),
              ...updates,
            },
          };
        }
        return c;
      })
    );
    triggerToast('Contacts Updated', 'Organization contact details updated.');
  };

  const updateApplicationInfo = (updates: Partial<ApplicationIntakeInfo>) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === activeCompanyId) {
          return {
            ...c,
            applicationInfo: {
              ...(c.applicationInfo || DEFAULT_APPLICATION_INFO),
              ...updates,
            },
          };
        }
        return c;
      })
    );
    triggerToast('Application Info Updated', 'Original application and intake information saved.');
  };

  // Reviewer info update
  const updateReviewerInfo = (name: string, title?: string, role?: string) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            name,
            title: title !== undefined ? title : r.title,
            role: role !== undefined ? role : r.role,
          };
        }
        return r;
      })
    );
  };

  const addNewReviewer = (name: string, title?: string, role?: string): string => {
    const initials =
      name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'RV';
    const newId = `rev_${Date.now()}`;
    const newRev: ReviewerScoreRecord = {
      id: newId,
      name: name.trim(),
      initials,
      title: title?.trim() || 'Committee Evaluator',
      role: role?.trim() || 'Evaluator',
      scores: {},
      notes: {},
      keyStrengths: '',
      supportNeeded: '',
      isSubmitted: false,
    };

    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        meetings: (c.meetings || []).map((m) => ({
          ...m,
          reviewers: [...m.reviewers, { ...newRev }],
        })),
      }))
    );

    setEvaluationsByCompany((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((compId) => {
        next[compId] = [...(next[compId] || []), { ...newRev }];
      });
      return next;
    });

    setActiveReviewerId(newId);
    triggerToast('Reviewer Added', `Added ${newRev.name} to the committee roster.`);
    return newId;
  };

  // Scoring actions (mutate active meeting's reviewers)
  const setScore = (questionId: string, rating: RatingValue | undefined) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          const nextScores = { ...r.scores };
          if (rating === undefined) {
            delete nextScores[questionId];
          } else {
            nextScores[questionId] = rating;
          }
          return { ...r, scores: nextScores };
        }
        return r;
      })
    );
  };

  const setQuestionNote = (questionId: string, noteText: string) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            notes: {
              ...(r.notes || {}),
              [questionId]: noteText,
            },
          };
        }
        return r;
      })
    );
  };

  const updateCriteriaDefinition = (questionId: string, updates: Partial<QuestionCriterion>) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return { ...q, ...updates };
        }
        return q;
      })
    );
    triggerToast('Criteria Updated', 'Rubric criteria updated successfully.');
  };

  const updateSectionHeader = (
    category: 'team' | 'market' | 'fit' | 'risk',
    updates: Partial<SectionHeaderConfig>
  ) => {
    setSectionHeaders((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates,
      },
    }));
    triggerToast('Section Header Updated', 'Rubric section header updated.');
  };

  const addCriterion = (
    category: 'team' | 'market' | 'fit' | 'risk',
    criteriaName: string,
    prompt: string
  ) => {
    const newId = `${category}_custom_${Date.now()}`;
    const newCriterion: QuestionCriterion = {
      id: newId,
      category,
      categoryTitle:
        sectionHeaders[category].statement ||
        `${sectionHeaders[category].title}: ${sectionHeaders[category].prompt}`,
      categoryShortTitle: category.toUpperCase(),
      criteriaName: criteriaName.trim() || 'Custom Criterion',
      prompt: prompt.trim() || 'Enter evaluation prompt question...',
      title: criteriaName.trim() || 'Custom Criterion',
      description: prompt.trim() || '',
      notesHeader: sectionHeaders[category].notesHeader,
      pitchNote: '',
      isCustom: true,
    };

    setQuestions((prev) => {
      const otherIndex = prev.findIndex((q) => q.category === category && q.isOther);
      if (otherIndex !== -1) {
        const next = [...prev];
        next.splice(otherIndex, 0, newCriterion);
        return next;
      }
      return [...prev, newCriterion];
    });

    triggerToast('Criterion Added', `Added "${newCriterion.criteriaName}" to rubric.`);
  };

  const deleteCriterion = (criterionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== criterionId));
    triggerToast('Criterion Removed', 'Criterion removed from rubric.');
  };

  const clearScorecard = () => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            scores: {},
            notes: {},
            keyStrengths: '',
            supportNeeded: '',
            isSubmitted: false,
          };
        }
        return r;
      })
    );
    triggerToast('Scorecard Cleared', 'All ratings and notes reset for this evaluator.');
  };

  const updateReviewerSummary = (strengths: string, support: string) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            keyStrengths: strengths,
            supportNeeded: support,
          };
        }
        return r;
      })
    );
    triggerToast('Summary Updated', 'Your qualitative observations have been updated.');
  };

  const setCategoryRating = (categoryKey: string, rating: number) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            categoryRatings: {
              ...(r.categoryRatings || {}),
              [categoryKey]: rating,
            },
          };
        }
        return r;
      })
    );
  };

  const setRecommendation = (recommendation: RecommendationDecision) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            recommendation,
          };
        }
        return r;
      })
    );
  };

  const setOverallSummary = (summary: string) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            overallSummary: summary,
          };
        }
        return r;
      })
    );
  };

  const setSectionComment = (categoryKey: string, comment: string) => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            sectionComments: {
              ...(r.sectionComments || {}),
              [categoryKey]: comment,
            },
          };
        }
        return r;
      })
    );
  };

  // Helper to compute category average for a specific reviewer
  const computeReviewerCategoryScores = (rev: ReviewerScoreRecord) => {
    const calcCat = (prefix: 'team' | 'market' | 'fit' | 'risk') => {
      if (rev.categoryRatings?.[prefix] !== undefined && rev.categoryRatings[prefix] > 0) {
        return rev.categoryRatings[prefix];
      }
      const qList = questions.filter((q) => q.category === prefix && !q.isOther);
      const scores = qList
        .map((q) => rev.scores[q.id])
        .filter((s): s is RatingValue => s !== undefined);
      if (scores.length === 0) return 0;
      const sum = scores.reduce((acc, curr) => acc + curr, 0);
      return Number((sum / scores.length).toFixed(1));
    };

    const team = calcCat('team');
    const market = calcCat('market');
    const fit = calcCat('fit');
    const risk = calcCat('risk');

    const ratedCats = [team, market, fit, risk, rev.categoryRatings?.tech].filter(
      (s): s is number => s !== undefined && s > 0
    );

    const overall =
      ratedCats.length > 0
        ? Number((ratedCats.reduce((acc, curr) => acc + curr, 0) / ratedCats.length).toFixed(1))
        : 0;

    return { team, market, fit, risk, overall };
  };

  // Current active reviewer calculations
  const { team, market, fit, risk, overall } = useMemo(() => {
    return computeReviewerCategoryScores(currentReviewer);
  }, [currentReviewer, questions]);

  const currentCategoryAverages = { team, market, fit, risk };
  const currentOverallAverage = overall;

  const allQuestionsAnswered = useMemo(() => {
    return questions
      .filter((q) => !q.isOther)
      .every((q) => currentReviewer.scores[q.id] !== undefined);
  }, [questions, currentReviewer]);

  // Committee matrix calculations across all reviewers for active meeting
  const committeeMatrix = useMemo(() => {
    const reviewerRows = reviewers.map((rev) => {
      const computed = computeReviewerCategoryScores(rev);
      return {
        reviewer: rev,
        teamAvg: computed.team,
        marketAvg: computed.market,
        fitAvg: computed.fit,
        riskAvg: computed.risk,
        overallAvg: computed.overall,
      };
    });

    const sumTeam = reviewerRows.reduce((a, b) => a + b.teamAvg, 0);
    const sumMarket = reviewerRows.reduce((a, b) => a + b.marketAvg, 0);
    const sumFit = reviewerRows.reduce((a, b) => a + b.fitAvg, 0);
    const sumRisk = reviewerRows.reduce((a, b) => a + b.riskAvg, 0);
    const sumOverall = reviewerRows.reduce((a, b) => a + b.overallAvg, 0);
    const count = reviewerRows.length || 1;

    return {
      reviewerRows,
      categoryAverages: {
        team: Number((sumTeam / count).toFixed(1)),
        market: Number((sumMarket / count).toFixed(1)),
        fit: Number((sumFit / count).toFixed(1)),
        risk: Number((sumRisk / count).toFixed(1)),
        total: Number((sumOverall / count).toFixed(1)),
      },
    };
  }, [reviewers, questions]);

  const saveProgress = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            lastSavedAt: `Last saved ${timestamp}`,
          };
        }
        return r;
      })
    );
    triggerToast('Draft Saved', `Evaluation draft for ${company.name} saved successfully.`);
  };

  const submitScorecard = () => {
    const submittedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            isSubmitted: true,
            submittedAt,
          };
        }
        return r;
      })
    );
    triggerToast(
      'Scorecard Submitted',
      `Scorecard for ${currentReviewer.name} (${company.name}) submitted to the committee record!`,
      'success'
    );
  };

  const reopenScorecard = () => {
    updateActiveMeetingReviewers((prevRevs) =>
      prevRevs.map((r) => {
        if (r.id === activeReviewerId) {
          return {
            ...r,
            isSubmitted: false,
          };
        }
        return r;
      })
    );
    triggerToast(
      'Submission Reopened',
      `Scorecard for ${currentReviewer.name} is now editable.`,
      'info'
    );
  };

  const approveCommitteeReview = () => {
    updateCompany({ admissionStatus: 'Approved' });
    triggerToast(
      'Incubation Approved',
      `Steering committee consensus finalized for ${company.name}. Status marked Approved.`,
      'success'
    );
  };

  const resetToDefaults = () => {
    setCompanies(INITIAL_COMPANIES);
    setActiveCompanyId('vayim');
    setActiveMeetingId('vayim_initial_pitch');
    setQuestions(QUESTIONS_DATA);
    setSectionHeaders(DEFAULT_SECTION_HEADERS);
    setEvaluationsByCompany({
      vayim: INITIAL_REVIEWERS,
    });
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_COMPANY);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_MEETING);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.SECTION_HEADERS);
    triggerToast('Reset Complete', 'Evaluations restored to default calibrated scores.');
  };

  return (
    <EvaluationContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        activeReviewerId,
        setActiveReviewerId,
        currentReviewer,
        reviewers,
        addNewReviewer,
        companies,
        activeCompanyId,
        setActiveCompanyId,
        company,
        updateCompany,
        addNewCompany,
        deleteCompany,
        isCompanyModalOpen,
        setIsCompanyModalOpen,
        activeMeetingId,
        setActiveMeetingId,
        activeMeeting,
        meetings,
        addProgressCheckin,
        createInitialPitch,
        updateMeetingFeedback,
        contractDetails,
        updateContractDetails,
        contractDocuments,
        addContractDocument,
        contactDetails,
        updateContactDetails,
        applicationInfo,
        updateApplicationInfo,
        questions,
        sectionHeaders,
        updateSectionHeader,
        addCriterion,
        deleteCriterion,
        setScore,
        setQuestionNote,
        updateCriteriaDefinition,
        clearScorecard,
        currentCategoryAverages,
        currentOverallAverage,
        allQuestionsAnswered,
        updateReviewerInfo,
        updateReviewerSummary,
        setCategoryRating,
        setRecommendation,
        setOverallSummary,
        setSectionComment,
        committeeMatrix,
        saveProgress,
        submitScorecard,
        reopenScorecard,
        approveCommitteeReview,
        resetToDefaults,
        toast,
        triggerToast,
        isWorkspaceModalOpen,
        setIsWorkspaceModalOpen,
        isEmailModalOpen,
        setIsEmailModalOpen,
        isPitchDeckModalOpen,
        setIsPitchDeckModalOpen,
        isImportModalOpen,
        setIsImportModalOpen,
        importCompanies,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
};
