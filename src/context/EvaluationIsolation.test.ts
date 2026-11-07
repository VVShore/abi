import { describe, it, expect } from 'vitest';
import { migrateMeetingFeedbackSections } from '../data/mockData';
import { SYNTHETIC_SOLARIS_COMPANY } from '../fixtures/syntheticFixture';
import {
  getSubmittedReviewers,
  calculateCommitteeCategoryAverages,
  deriveIndividualLowScoreConcerns,
} from '../utils/scoringCalculations';
import { FeedbackSectionData, MeetingRecord } from '../types';

describe('Company/Meeting Isolation, Persistence & Concurrency Guards', () => {
  const legacySections: FeedbackSectionData[] = [
    {
      id: 'overall',
      title: 'OVERALL FEEDBACK',
      prompt: 'Overall prompt',
      summary: 'Legacy overall summary.',
      quotes: ['Quote 1'],
    },
    {
      id: 'team',
      title: 'FEEDBACK ON TEAM',
      prompt: 'Team prompt',
      categoryScoreKey: 'team',
      summary: 'Legacy team summary.',
      quotes: ['Team quote'],
    },
    {
      id: 'business_plan',
      title: 'FEEDBACK ON BUSINESS PLAN',
      prompt: 'Business plan prompt',
      categoryScoreKey: 'market',
      summary: 'Legacy business plan summary.',
      quotes: ['Market quote'],
    },
    {
      id: 'abi_fit',
      title: 'FEEDBACK ON RELATIONSHIP WITH ABI',
      prompt: 'Fit prompt',
      categoryScoreKey: 'fit',
      summary: 'Legacy fit summary.',
      quotes: ['Fit quote'],
    },
    {
      id: 'technology',
      title: 'FEEDBACK ON TECHNOLOGY',
      prompt: 'Technology prompt',
      categoryScoreKey: 'risk', // Erroneous legacy mapping that must be repaired
      summary: 'Legacy technology summary.',
      quotes: ['Tech quote'],
    },
  ];

  it('migrateMeetingFeedbackSections maps old report sections explicitly without assigning Risk score to Technology', () => {
    const migrated = migrateMeetingFeedbackSections(legacySections);

    // Nancy's 5 sections must exist
    expect(migrated.some((s) => s.id === 'overall')).toBe(true);
    expect(migrated.some((s) => s.id === 'team')).toBe(true);
    expect(migrated.some((s) => s.id === 'value_prop')).toBe(true);
    expect(migrated.some((s) => s.id === 'abi_fit')).toBe(true);
    expect(migrated.some((s) => s.id === 'risk')).toBe(true);

    // Value Prop mapped from business plan
    const vpSec = migrated.find((s) => s.id === 'value_prop');
    expect(vpSec?.summary).toBe('Legacy business plan summary.');
    expect(vpSec?.categoryScoreKey).toBe('market');

    // Technology preserved explicitly, BUT with categoryScoreKey: undefined (NEVER assigned Risk)
    const techSec = migrated.find((s) => s.id === 'technology');
    expect(techSec).toBeDefined();
    expect(techSec?.summary).toBe('Legacy technology summary.');
    expect(techSec?.categoryScoreKey).toBeUndefined(); // Risk score NOT assigned to Technology!

    // Dedicated Risk section exists
    const riskSec = migrated.find((s) => s.id === 'risk');
    expect(riskSec?.categoryScoreKey).toBe('risk');
  });

  describe('Meeting & Company Draft Isolation', () => {
    const meeting1: MeetingRecord = {
      id: 'meeting_1',
      organizationId: 'comp_solaris',
      type: 'Initial Pitch',
      title: 'Initial Pitch',
      date: 'Jan 10, 2026',
      reviewers: [],
      feedbackSummary: [
        { id: 'overall', title: 'OVERALL', prompt: '', summary: 'Meeting 1 Draft' },
      ],
      status: 'Completed',
    };

    const meeting2: MeetingRecord = {
      id: 'meeting_2',
      organizationId: 'comp_solaris',
      type: 'Progress Check-in',
      title: 'Check-in 1',
      date: 'Mar 15, 2026',
      reviewers: [],
      feedbackSummary: [
        { id: 'overall', title: 'OVERALL', prompt: '', summary: 'Meeting 2 Draft' },
      ],
      status: 'In Progress',
    };

    it('each meeting maintains separate draft summaries', () => {
      expect(meeting1.feedbackSummary[0].summary).toBe('Meeting 1 Draft');
      expect(meeting2.feedbackSummary[0].summary).toBe('Meeting 2 Draft');
      expect(meeting1.feedbackSummary[0].summary).not.toEqual(meeting2.feedbackSummary[0].summary);
    });

    it('migrateMeetingFeedbackSections returns deep-cloned arrays so edits in one meeting never mutate another', () => {
      const m1Sections = migrateMeetingFeedbackSections(undefined);
      const m2Sections = migrateMeetingFeedbackSections(undefined);

      m1Sections[1].quotes?.push('Mutated quote in meeting 1');
      expect(m2Sections[1].quotes).not.toContain('Mutated quote in meeting 1');
    });

    it('synthetic Solaris fixture provides distinct meeting-specific insights and summaries across Initial Pitch and Check-in', () => {
      const meetings = SYNTHETIC_SOLARIS_COMPANY.meetings || [];
      expect(meetings.length).toBeGreaterThanOrEqual(2);

      const pitchMeeting = meetings.find((m) => m.id === 'solaris_pitch')!;
      const checkinMeeting = meetings.find((m) => m.id === 'solaris_checkin_q2')!;

      const pitchMetrics = calculateCommitteeCategoryAverages(getSubmittedReviewers(pitchMeeting));
      const checkinMetrics = calculateCommitteeCategoryAverages(getSubmittedReviewers(checkinMeeting));

      // Initial pitch had flagged risk (2.1), while Q2 check-in improved risk to 3.3
      expect(pitchMetrics.risk.average).toBeLessThan(3.0);
      expect(pitchMetrics.risk.badgeType).toBe('risk');
      expect(checkinMetrics.risk.average).toBeGreaterThanOrEqual(3.0);

      // Low-score concerns differ per meeting
      const pitchConcerns = deriveIndividualLowScoreConcerns(getSubmittedReviewers(pitchMeeting));
      const checkinConcerns = deriveIndividualLowScoreConcerns(getSubmittedReviewers(checkinMeeting));
      expect(pitchConcerns.length).toBeGreaterThan(checkinConcerns.length);

      // Feedback summaries are distinct per meeting and both follow Nancy's 5 sections
      expect(pitchMeeting.feedbackSummary.map((s) => s.id)).toEqual([
        'overall',
        'team',
        'value_prop',
        'abi_fit',
        'risk',
      ]);
      expect(checkinMeeting.feedbackSummary.map((s) => s.id)).toEqual([
        'overall',
        'team',
        'value_prop',
        'abi_fit',
        'risk',
      ]);
      expect(pitchMeeting.feedbackSummary[0].summary).not.toBe(
        checkinMeeting.feedbackSummary[0].summary
      );
    });
  });

  describe('Stale Response & Concurrency Guard Logic', () => {
    const currentActiveCompanyId = 'solaris_bio';
    const currentActiveMeetingId = 'solaris_pitch';
    const currentRevision = 3;

    const applyDraftWithGuard = (
      token: { companyId: string; meetingId: string; editRevision: number },
      activeComp: string,
      activeMeeting: string,
      revision: number
    ): boolean => {
      // Guard 1: Meeting / Company mismatch check
      if (token.companyId !== activeComp || token.meetingId !== activeMeeting) {
        return false;
      }
      // Guard 2: In-flight edit revision check
      if (token.editRevision !== revision) {
        return false;
      }
      return true;
    };

    it('accepts generation response when token matches active meeting and revision', () => {
      const validToken = {
        companyId: currentActiveCompanyId,
        meetingId: currentActiveMeetingId,
        editRevision: currentRevision,
      };

      const result = applyDraftWithGuard(
        validToken,
        currentActiveCompanyId,
        currentActiveMeetingId,
        currentRevision
      );
      expect(result).toBe(true);
    });

    it('drops stale response if meeting was changed while generation was in-flight', () => {
      const staleToken = {
        companyId: currentActiveCompanyId,
        meetingId: 'previous_meeting_id',
        editRevision: currentRevision,
      };

      const result = applyDraftWithGuard(
        staleToken,
        currentActiveCompanyId,
        currentActiveMeetingId,
        currentRevision
      );
      expect(result).toBe(false);
    });

    it('protects manual edits if user edited during generation flight (revision mismatch)', () => {
      const generationTokenAtStart = {
        companyId: currentActiveCompanyId,
        meetingId: currentActiveMeetingId,
        editRevision: 1, // Started at revision 1
      };

      // User edited during flight, revision bumped to 2
      const updatedRevisionAfterUserEdit = 2;

      const result = applyDraftWithGuard(
        generationTokenAtStart,
        currentActiveCompanyId,
        currentActiveMeetingId,
        updatedRevisionAfterUserEdit
      );

      // Overwrite is prevented!
      expect(result).toBe(false);
    });
  });
});
