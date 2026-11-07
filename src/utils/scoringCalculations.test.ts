import { describe, it, expect } from 'vitest';
import {
  getSubmittedReviewers,
  calculateCommitteeCategoryAverages,
  extractEvaluatorPills,
  formatReviewerFirstAndLastInitial,
  deriveIndividualLowScoreConcerns,
} from './scoringCalculations';
import { MeetingRecord, ReviewerScoreRecord } from '../types';

describe('scoringCalculations', () => {
  const createMockReviewer = (
    id: string,
    name: string,
    isSubmitted: boolean,
    scores: Record<string, any>,
    categoryRatings?: Record<string, number>,
    notes?: Record<string, string>
  ): ReviewerScoreRecord => ({
    id,
    name,
    initials: id.toUpperCase(),
    title: 'Reviewer Title',
    role: 'Committee Member',
    scores,
    categoryRatings,
    notes,
    isSubmitted,
  });

  const submitted1 = createMockReviewer(
    'rev1',
    'Dr. Alice Green',
    true,
    {
      team_coachability: 4,
      team_qualifications: 4,
      market_pmf: 5,
      fit_labspace: 4,
      risk_regulatory: 2, // Low individual score <= 2
    },
    { team: 4, market: 5, fit: 4, risk: 2 },
    { risk_regulatory: 'Lacks preclinical toxicology validation.' }
  );

  const submitted2 = createMockReviewer(
    'rev2',
    'Bob Stone',
    true,
    {
      team_coachability: 4,
      team_qualifications: 4,
      market_pmf: 3,
      fit_labspace: 4,
      risk_regulatory: 4,
      risk_ip: 1, // Low individual score <= 2
    },
    { team: 4, market: 3, fit: 4, risk: 2.5 },
    { risk_ip: 'Expired foundation patents detected.' }
  );

  const unsubmittedReviewer = createMockReviewer(
    'rev3',
    'Charlie Draft',
    false,
    {
      team_coachability: 1,
      market_pmf: 1,
      fit_labspace: 1,
      risk_regulatory: 1,
    },
    { team: 1, market: 1, fit: 1, risk: 1 }
  );

  const mockMeeting: MeetingRecord = {
    id: 'test_meeting_01',
    organizationId: 'comp_01',
    type: 'Initial Pitch',
    title: 'Test Meeting 01',
    date: 'Feb 12, 2026',
    reviewers: [submitted1, submitted2, unsubmittedReviewer],
    feedbackSummary: [],
    status: 'In Progress',
  };

  it('getSubmittedReviewers filters strictly for isSubmitted === true', () => {
    const result = getSubmittedReviewers(mockMeeting);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(['rev1', 'rev2']);
    expect(result.some((r) => r.id === 'rev3')).toBe(false);
  });

  it('getSubmittedReviewers safely handles undefined or empty meetings', () => {
    expect(getSubmittedReviewers(undefined)).toEqual([]);
    expect(getSubmittedReviewers({ reviewers: [] } as any)).toEqual([]);
  });

  it('calculateCommitteeCategoryAverages calculates arithmetic means across submitted reviewers only', () => {
    const submitted = getSubmittedReviewers(mockMeeting);
    const metrics = calculateCommitteeCategoryAverages(submitted);

    expect(metrics.totalSubmitted).toBe(2);
    // Team: (4 + 4) / 2 = 4.0
    expect(metrics.team.average).toBe(4.0);
    // Market: (5 + 3) / 2 = 4.0
    expect(metrics.market.average).toBe(4.0);
    // Fit: (4 + 4) / 2 = 4.0
    expect(metrics.fit.average).toBe(4.0);
    // Risk: (2 + 2.5) / 2 = 2.25 -> 2.3 (Flagged Risk because < 3.0)
    expect(metrics.risk.average).toBe(2.3);
    expect(metrics.risk.badgeType).toBe('risk');
    expect(metrics.risk.badgeText).toBe('Flagged Risk');
  });

  it('calculateCommitteeCategoryAverages handles zero submitted reviewers gracefully', () => {
    const metrics = calculateCommitteeCategoryAverages([]);
    expect(metrics.totalSubmitted).toBe(0);
    expect(metrics.team.average).toBe(0);
    expect(metrics.market.average).toBe(0);
    expect(metrics.fit.average).toBe(0);
    expect(metrics.risk.average).toBe(0);
    expect(metrics.overall).toBe(0);
  });

  it('deriveIndividualLowScoreConcerns derives concerns from individual ratings of 1 or 2', () => {
    const submitted = getSubmittedReviewers(mockMeeting);
    const concerns = deriveIndividualLowScoreConcerns(submitted);

    expect(concerns.length).toBeGreaterThanOrEqual(2);

    const regulatoryConcern = concerns.find((c) => c.criterionId === 'risk_regulatory');
    expect(regulatoryConcern).toBeDefined();
    expect(regulatoryConcern?.score).toBe(2);
    expect(regulatoryConcern?.reviewerName).toBe('Dr. Alice Green');
    expect(regulatoryConcern?.noteOrComment).toContain('preclinical toxicology');

    const ipConcern = concerns.find((c) => c.criterionId === 'risk_ip');
    expect(ipConcern).toBeDefined();
    expect(ipConcern?.score).toBe(1);
    expect(ipConcern?.reviewerName).toBe('Bob Stone');
    expect(ipConcern?.noteOrComment).toContain('Expired foundation patents');
  });

  it('extractEvaluatorPills formats first name and last initial and score bounds', () => {
    const submitted = getSubmittedReviewers(mockMeeting);
    const pills = extractEvaluatorPills(submitted, 'market');

    expect(pills).toHaveLength(2);
    expect(pills[0].name).toBe('Alice G.');
    expect(pills[0].score).toBe(5);
    expect(pills[0].isHigh).toBe(true);

    expect(pills[1].name).toBe('Bob S.');
    expect(pills[1].score).toBe(3);

    expect(formatReviewerFirstAndLastInitial('Richard Smith')).toBe('Richard S.');
    expect(formatReviewerFirstAndLastInitial('Dr. Alistair Finch')).toBe('Alistair F.');
  });
});
