import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  RatingValue,
  QuestionCriterion,
  ReviewerScoreRecord,
  CompanyAssessment,
  SectionHeaderConfig,
  RecommendationDecision,
} from '../types';
import {
  INITIAL_COMPANIES,
  INITIAL_COMPANY,
  QUESTIONS_DATA,
  INITIAL_REVIEWERS,
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

interface EvaluationContextType {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  activeReviewerId: string;
  setActiveReviewerId: (id: string) => void;
  currentReviewer: ReviewerScoreRecord;
  reviewers: ReviewerScoreRecord[];
  addNewReviewer: (name: string, title?: string, role?: string) => string;
  
  // Company management
  companies: CompanyAssessment[];
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  company: CompanyAssessment;
  updateCompany: (updates: Partial<CompanyAssessment>) => void;
  addNewCompany: (companyData?: Partial<CompanyAssessment>) => string;
  deleteCompany: (companyId: string) => void;
  isCompanyModalOpen: boolean;
  setIsCompanyModalOpen: (open: boolean) => void;

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
  updateReviewerInfo: (name: string, title?: string) => void;
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
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPANIES: 'abi_companies_v4',
  ACTIVE_COMPANY: 'abi_active_company_id_v4',
  EVALUATIONS: 'abi_evaluations_by_company_v4',
  QUESTIONS: 'abi_questions_v4',
  SECTION_HEADERS: 'abi_section_headers_v4',
};

const createBlankReviewerSet = (): ReviewerScoreRecord[] => {
  return INITIAL_REVIEWERS.map((r) => ({
    ...r,
    scores: {},
    notes: {},
    keyStrengths: '',
    supportNeeded: '',
    isSubmitted: false,
    submittedAt: undefined,
  }));
};

export const EvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('individual');
  const [activeReviewerId, setActiveReviewerId] = useState<string>('nl');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Companies state
  const [companies, setCompanies] = useState<CompanyAssessment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_COMPANIES;
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

  // Evaluations by company
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
      bionanox: INITIAL_REVIEWERS.map((r) => ({
        ...r,
        scores: {
          team_coachability: 4,
          team_qualifications: 4,
          team_skillset: 3,
          market_pmf: 4,
          market_competitive: 4,
          market_traction: 3,
          market_ecosystem: 4,
          fit_labspace: 5,
          fit_abifit: 4,
          fit_students: 4,
          fit_goodcitizen: 4,
          risk_regulatory: 3,
          risk_commercial: 3,
          risk_ip: 4,
          risk_funding: 3,
          risk_revenue: 3,
        },
        notes: {
          team_coachability: 'Founders receptive to guidance on diagnostic sensitivity assays.',
          fit_labspace: 'Direct match for BSL-2 biosafety hoods and spectrophotometers.',
        },
        keyStrengths: 'High technical aptitude in microfluidic engineering and point-of-care diagnostics.',
        supportNeeded: 'Regulatory guidance on CLIA waiver submission.',
        isSubmitted: false,
      })),
      austin_cell: INITIAL_REVIEWERS.map((r) => ({
        ...r,
        scores: {
          team_coachability: 5,
          team_qualifications: 5,
          team_skillset: 4,
          market_pmf: 4,
          market_competitive: 4,
          market_traction: 4,
          market_ecosystem: 4,
          fit_labspace: 4,
          fit_abifit: 5,
          fit_students: 5,
          fit_goodcitizen: 5,
          risk_regulatory: 4,
          risk_commercial: 4,
          risk_ip: 4,
          risk_funding: 4,
          risk_revenue: 4,
        },
        notes: {},
        keyStrengths: 'Serial biotech entrepreneurs with proven track record in stem cell biology.',
        supportNeeded: 'Liquid nitrogen cryogenic dewars calibration.',
        isSubmitted: true,
      })),
    };
  });

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY, activeCompanyId);
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluationsByCompany));
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      localStorage.setItem(STORAGE_KEYS.SECTION_HEADERS, JSON.stringify(sectionHeaders));
    } catch {
      // ignore
    }
  }, [companies, activeCompanyId, evaluationsByCompany, questions, sectionHeaders]);

  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Active Company
  const company = useMemo(() => {
    return companies.find((c) => c.id === activeCompanyId) || companies[0] || INITIAL_COMPANY;
  }, [companies, activeCompanyId]);

  // Reviewers for the currently active company
  const reviewers = useMemo(() => {
    return evaluationsByCompany[activeCompanyId] || INITIAL_REVIEWERS;
  }, [evaluationsByCompany, activeCompanyId]);

  const currentReviewer = useMemo(() => {
    return reviewers.find((r) => r.id === activeReviewerId) || reviewers[0];
  }, [reviewers, activeReviewerId]);

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
    const newComp: CompanyAssessment = {
      id: newId,
      name: companyData?.name?.trim() || 'New Bioscience Applicant',
      round: companyData?.round || 'Round 1 Evaluation',
      cohort: companyData?.cohort || 'Cohort 2026.1 Assessment',
      reviewDate: companyData?.reviewDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      domain: companyData?.domain || 'Biotechnology / Therapeutics',
      admissionStatus: companyData?.admissionStatus || 'Pending',
      thresholdScore: companyData?.thresholdScore || 3.5,
    };

    setCompanies((prev) => [...prev, newComp]);
    setEvaluationsByCompany((prev) => ({
      ...prev,
      [newId]: createBlankReviewerSet(),
    }));
    setActiveCompanyId(newId);
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
    }
    setEvaluationsByCompany((prev) => {
      const next = { ...prev };
      delete next[companyId];
      return next;
    });
    triggerToast('Company Removed', 'The company evaluation has been deleted.');
  };

  // Reviewer info update
  const updateReviewerInfo = (name: string, title?: string, role?: string) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              name,
              title: title !== undefined ? title : r.title,
              role: role !== undefined ? role : r.role,
            };
          }
          return r;
        }),
      };
    });
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

  // Scoring actions for active company
  const setScore = (questionId: string, rating: RatingValue | undefined) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            const nextScores = { ...r.scores };
            if (rating === undefined) {
              delete nextScores[questionId];
            } else {
              nextScores[questionId] = rating;
            }
            return {
              ...r,
              scores: nextScores,
            };
          }
          return r;
        }),
      };
    });
  };

  const setQuestionNote = (questionId: string, noteText: string) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
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
        }),
      };
    });
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
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
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
        }),
      };
    });
    triggerToast('Scorecard Cleared', 'All ratings and notes reset for this evaluator.');
  };

  const updateReviewerSummary = (strengths: string, support: string) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              keyStrengths: strengths,
              supportNeeded: support,
            };
          }
          return r;
        }),
      };
    });
    triggerToast('Summary Updated', 'Your qualitative observations have been updated.');
  };

  const setCategoryRating = (categoryKey: string, rating: number) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
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
        }),
      };
    });
  };

  const setRecommendation = (recommendation: RecommendationDecision) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              recommendation,
            };
          }
          return r;
        }),
      };
    });
  };

  const setOverallSummary = (summary: string) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              overallSummary: summary,
            };
          }
          return r;
        }),
      };
    });
  };

  const setSectionComment = (categoryKey: string, comment: string) => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
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
        }),
      };
    });
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

  // Committee matrix calculations across all reviewers for active company
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
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              lastSavedAt: `Last saved ${timestamp}`,
            };
          }
          return r;
        }),
      };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluationsByCompany));
      triggerToast('Draft Saved', `Evaluation draft for ${company.name} saved successfully.`);
    } catch {
      triggerToast('Notice', 'Scorecard state saved to session memory.', 'info');
    }
  };

  const submitScorecard = () => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              isSubmitted: true,
              submittedAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            };
          }
          return r;
        }),
      };
    });
    triggerToast(
      'Scorecard Submitted',
      `Scorecard for ${currentReviewer.name} (${company.name}) submitted to the committee record!`,
      'success'
    );
  };

  const reopenScorecard = () => {
    setEvaluationsByCompany((prev) => {
      const companyRevList = prev[activeCompanyId] || reviewers;
      return {
        ...prev,
        [activeCompanyId]: companyRevList.map((r) => {
          if (r.id === activeReviewerId) {
            return {
              ...r,
              isSubmitted: false,
            };
          }
          return r;
        }),
      };
    });
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
    setQuestions(QUESTIONS_DATA);
    setSectionHeaders(DEFAULT_SECTION_HEADERS);
    setEvaluationsByCompany({
      vayim: INITIAL_REVIEWERS,
    });
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_COMPANY);
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
