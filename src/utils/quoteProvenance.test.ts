import { describe, it, expect } from 'vitest';
import {
  findMatchingSourceField,
  validateQuoteProvenance,
  extractSourceQuotesForCategory,
  resolveSectionQuoteRefs,
  buildDeterministicMeetingDraft,
} from './quoteProvenance';
import { ReviewerScoreRecord, ValidatedQuoteRef, FeedbackSectionData } from '../types';

describe('quoteProvenance', () => {
  const mockReviewer: ReviewerScoreRecord = {
    id: 'rev_prov_1',
    name: 'Nancy Lyon',
    initials: 'NL',
    title: 'Lead Facilitator',
    role: 'Steering Committee',
    scores: {},
    categoryRatings: { team: 4, market: 4 },
    sectionComments: {
      team: 'Founders communicated openly regarding training needs in microbiology.',
      market: 'Strong clinical pull from regional physicians.',
    },
    notes: {
      team_coachability: 'Very open during Q&A and welcomed technical mentoring.',
    },
    keyStrengths: 'Deep domain expertise in bioscience assays.',
    supportNeeded: 'Regulatory guidance on CLIA waiver submission.',
    isSubmitted: true,
  };

  const submittedReviewers = [mockReviewer];

  it('findMatchingSourceField finds verbatim or normalized text in sectionComments', () => {
    const field = findMatchingSourceField(
      mockReviewer,
      'Founders communicated openly regarding training needs'
    );
    expect(field).toBe('sectionComments');
  });

  it('findMatchingSourceField finds text in notes and keyStrengths', () => {
    const noteField = findMatchingSourceField(mockReviewer, 'welcomed technical mentoring');
    expect(noteField).toBe('notes');

    const strengthField = findMatchingSourceField(mockReviewer, 'Deep domain expertise');
    expect(strengthField).toBe('keyStrengths');
  });

  it('validateQuoteProvenance validates genuine quote references as verified', () => {
    const quoteRef: ValidatedQuoteRef = {
      id: 'q1',
      quote: 'Founders communicated openly regarding training needs in microbiology.',
      reviewerId: 'rev_prov_1',
      reviewerName: 'Nancy Lyon',
      reviewerRole: 'Steering Committee',
      verificationStatus: 'verified',
    };

    const result = validateQuoteProvenance(quoteRef, submittedReviewers);
    expect(result.isValidReference).toBe(true);
    expect(result.verificationStatus).toBe('verified');
    expect(result.matchedReviewer?.id).toBe('rev_prov_1');
    expect(result.sourceField).toBe('sectionComments');
  });

  it('validateQuoteProvenance rejects invented reviewer references as unverified', () => {
    const quoteRef: ValidatedQuoteRef = {
      id: 'q_fake',
      quote: 'This startup is going to IPO tomorrow.',
      reviewerId: 'fake_reviewer_99',
      reviewerName: 'Nonexistent Reviewer',
      reviewerRole: 'Visitor',
      verificationStatus: 'verified',
    };

    const result = validateQuoteProvenance(quoteRef, submittedReviewers);
    expect(result.isValidReference).toBe(false);
    expect(result.verificationStatus).toBe('unverified');
  });

  it('validateQuoteProvenance identifies user-edited quotes rather than labeling them verbatim', () => {
    const quoteRef: ValidatedQuoteRef = {
      id: 'q_edited',
      quote: 'Founders communicated openly, but we modified this statement manually.',
      reviewerId: 'rev_prov_1',
      reviewerName: 'Nancy Lyon',
      reviewerRole: 'Steering Committee',
      verificationStatus: 'verified',
    };

    const result = validateQuoteProvenance(quoteRef, submittedReviewers);
    expect(result.isValidReference).toBe(true);
    // Identifies edited quotes
    expect(result.verificationStatus).toBe('edited');
  });

  it('extractSourceQuotesForCategory extracts valid quotes directly from submitted reviewers', () => {
    const quotes = extractSourceQuotesForCategory(submittedReviewers, 'team');
    expect(quotes.length).toBeGreaterThanOrEqual(1);
    expect(quotes[0].quote).toContain('training needs in microbiology');
    expect(quotes[0].reviewerName).toBe('Nancy Lyon');
    expect(quotes[0].verificationStatus).toBe('verified');
  });

  it('resolveSectionQuoteRefs verifies legacy quotes when matched and flags unmatched legacy quotes as unverified', () => {
    const legacySection: FeedbackSectionData = {
      id: 'team',
      title: 'FEEDBACK ON TEAM',
      prompt: 'Team prompt',
      summary: 'Team summary',
      quotes: [
        'Founders communicated openly regarding training needs in microbiology.',
        'Completely unattributed legacy quote not present in any submitted scorecard.',
      ],
      quoteRefs: [],
    };

    const resolved = resolveSectionQuoteRefs(legacySection, submittedReviewers);
    expect(resolved).toHaveLength(2);
    expect(resolved[0].verificationStatus).toBe('verified');
    expect(resolved[0].reviewerName).toBe('Nancy Lyon');
    expect(resolved[1].verificationStatus).toBe('unverified');
  });

  it('resolveSectionQuoteRefs preserves edited status on user-edited and custom quotes', () => {
    const editedSection: FeedbackSectionData = {
      id: 'team',
      title: 'FEEDBACK ON TEAM',
      prompt: 'Team prompt',
      summary: 'Team summary',
      quotes: ['Custom committee observation edited by user.'],
      quoteRefs: [
        {
          id: 'custom_1',
          quote: 'Custom committee observation edited by user.',
          reviewerId: 'custom',
          reviewerName: 'Committee Member',
          reviewerRole: 'Steering Committee',
          verificationStatus: 'edited',
        },
      ],
    };

    const resolved = resolveSectionQuoteRefs(editedSection, submittedReviewers);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].verificationStatus).toBe('edited');
    expect(resolved[0].quote).toBe('Custom committee observation edited by user.');
  });

  it('buildDeterministicMeetingDraft generates all 5 Nancy sections isolated to the target company and meeting', () => {
    const draft = buildDeterministicMeetingDraft(
      'Vayim Therapeutics',
      'Q1 Progress Check-in',
      submittedReviewers
    );

    expect(draft.map((s) => s.id)).toEqual(['overall', 'team', 'value_prop', 'abi_fit', 'risk']);
    expect(draft[0].summary).toContain('Vayim Therapeutics');
    expect(draft[0].summary).toContain('Q1 Progress Check-in');
    const teamQuotes = draft.find((s) => s.id === 'team')?.quoteRefs || [];
    expect(teamQuotes.length).toBeGreaterThan(0);
    expect(teamQuotes[0].verificationStatus).toBe('verified');
  });
});
