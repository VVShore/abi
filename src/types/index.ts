export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface QuestionCriterion {
  id: string;
  category: 'team' | 'market' | 'fit' | 'risk';
  categoryTitle: string; // Exact category header from Excel
  categoryShortTitle: string;
  criteriaName: string; // e.g. "Coachability"
  prompt: string; // e.g. "Are they open to feedback & mentoring?"
  title: string; // backwards compatibility
  description: string; // backwards compatibility
  notesHeader: string; // e.g. "Team Notes", "Value Prop Notes"
  pitchNote: string;
  pitchNoteAuthor?: string;
  questionNumber?: number;
  isOther?: boolean;
  isCustom?: boolean;
  icon?: string;
  noteBadgeIcon?: string;
}

export interface SectionHeaderConfig {
  title: string;
  prompt: string;
  statement?: string;
  notesHeader: string;
}

export type RecommendationDecision = 'Recommend Admission' | 'Conditional' | 'Decline';

export interface ReviewerScoreRecord {
  id: string;
  name: string;
  initials: string;
  title: string;
  role: string;
  scores: Record<string, RatingValue>;
  notes?: Record<string, string>;
  categoryRatings?: Record<string, number>;
  keyStrengths?: string;
  supportNeeded?: string;
  isSubmitted: boolean;
  submittedAt?: string;
  recommendation?: RecommendationDecision;
  overallSummary?: string;
  sectionComments?: Record<string, string>;
  lastSavedAt?: string;
}

export interface CategorySummary {
  id: 'team' | 'market' | 'fit' | 'risk';
  name: string;
  subtitle: string;
  score: number;
}

export interface KeyPriority {
  id: number;
  categoryTag: string;
  title: string;
  badge: string;
  badgeIcon: string;
  companyAction: string;
  accSupport: string;
}

export interface TopicQuote {
  reviewerName: string;
  reviewerInitials: string;
  reviewerRole: string;
  score: number;
  isTopScore?: boolean;
  quote: string;
}

export type TopicId = 'coachability' | 'pmf' | 'labspace' | 'regulatory';

export interface EvaluationTopic {
  id: TopicId;
  label: string;
  icon: string;
  quotes: TopicQuote[];
}

export interface CompanyAssessment {
  id: string;
  name: string;
  round: string;
  cohort: string;
  reviewDate: string;
  domain: string;
  admissionStatus: 'Approved' | 'Pending' | 'Declined';
  thresholdScore: number;
}
