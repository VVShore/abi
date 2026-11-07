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

// ---------------------------------------------------------------------------
// Single Company / Organization & Meeting Architecture
// ---------------------------------------------------------------------------

export type QuoteVerificationStatus = 'verified' | 'edited' | 'unverified';

export interface ValidatedQuoteRef {
  id: string;
  quote: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerInitials?: string;
  score?: number;
  categoryKey?: 'team' | 'market' | 'fit' | 'risk';
  sourceField?: 'sectionComments' | 'notes' | 'keyStrengths' | 'supportNeeded' | 'overallSummary';
  verificationStatus: QuoteVerificationStatus;
}

export interface FeedbackSectionData {
  id: string; // 'overall' | 'team' | 'value_prop' | 'abi_fit' | 'risk' or legacy ids
  title: string;
  prompt: string;
  summary: string;
  quotes?: string[]; // backwards compatibility
  quoteRefs?: ValidatedQuoteRef[];
  categoryScoreKey?: 'team' | 'market' | 'fit' | 'risk';
}

export interface OrganizationContactDetails {
  primaryContactName: string;
  roleOrTitle: string;
  email: string;
  phone: string;
  website: string;
  linkedIn?: string;
  mailingAddress?: string;
}

export interface ApplicationIntakeInfo {
  submittedAt: string;
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  stageOfDevelopment: string;
  targetMarket: string;
  teamBackground: string;
  fundingRaisedToDate: string;
  spaceRequirements: string;
  additionalFields?: Record<string, string>;
}

export interface OrganizationContractDetails {
  status: 'Draft' | 'Active' | 'Pending Execution' | 'Completed' | 'Terminated';
  agreementDate: string;
  effectiveStartDate: string;
  termEndDate: string;
  monthlyFee: string;
  securityDeposit: string;
  billingCadence: string;
  rooms: string[];
  benches: string[];
  instrumentAccess: string[];
  specialConditions: string;
}

export type ContractDocumentType =
  | 'Original Contract'
  | 'Amendment'
  | 'Addendum'
  | 'Protocol'
  | 'Pitch Deck'
  | 'Other';

export interface ContractDocument {
  id: string;
  organizationId: string;
  title: string;
  documentType: ContractDocumentType;
  uploadedAt: string;
  fileSize?: string;
  fileType?: string;
  uploadedDuringMeetingId?: string; // Optionally records the meeting during which it was uploaded
}

export type MeetingType = 'Initial Pitch' | 'Progress Check-in';

export interface MeetingRecord {
  id: string;
  organizationId: string;
  type: MeetingType;
  title: string;
  date: string;
  deckTitle?: string;
  deckSlideCount?: number;
  deckDocumentId?: string;
  reviewers: ReviewerScoreRecord[];
  feedbackSummary: FeedbackSectionData[];
  status: 'Completed' | 'In Progress' | 'Scheduled';
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
  // Organization Extensions
  contactDetails?: OrganizationContactDetails;
  applicationInfo?: ApplicationIntakeInfo;
  contractDetails?: OrganizationContractDetails;
  contractDocuments?: ContractDocument[];
  meetings?: MeetingRecord[];
}

export type Organization = CompanyAssessment;
