import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  GeminiFeedbackService,
  validateSynthesizedResponse,
  buildSynthesisPrompt,
} from './geminiService';
import { ALLOWLISTED_FIXTURE_ID, SYNTHETIC_SOLARIS_REVIEWERS } from './fixtures/syntheticFixture';

describe('GeminiFeedbackService & Backend Security Gates', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Demo Mode (Synthetic Deterministic)', () => {
    it('generates demo synthetic draft with allowlisted fixture ID', () => {
      const result = GeminiFeedbackService.generateDemoDraft(ALLOWLISTED_FIXTURE_ID);
      expect(result.mode).toBe('demo_synthetic');
      expect(result.sections).toHaveLength(5);
      expect(result.metadata.disclaimer).toContain('Demo Mode · Deterministic Synthetic Response');
      expect(result.metadata.fixtureId).toBe(ALLOWLISTED_FIXTURE_ID);

      const sectionIds = result.sections.map((s) => s.id);
      expect(sectionIds).toEqual(['overall', 'team', 'value_prop', 'abi_fit', 'risk']);
    });

    it('rejects unrecognized fixture IDs in demo mode', () => {
      expect(() =>
        GeminiFeedbackService.generateDemoDraft('UNAUTHORIZED_FIXTURE_XYZ')
      ).toThrow('Unknown fixture ID');
    });

    it('returns meeting-specific synthetic draft when meetingId is solaris_checkin_q2', () => {
      const pitchDraft = GeminiFeedbackService.generateDemoDraft(ALLOWLISTED_FIXTURE_ID, 'solaris_pitch');
      const checkinDraft = GeminiFeedbackService.generateDemoDraft(
        ALLOWLISTED_FIXTURE_ID,
        'solaris_checkin_q2'
      );

      expect(pitchDraft.sections[0].summary).not.toBe(checkinDraft.sections[0].summary);
      expect(checkinDraft.sections[0].summary).toContain('Q2 Progress Check-in');
    });
  });

  describe('Live AI Gating & Security Enforcement', () => {
    it('strictly disables live Gemini calls by default when LIVE_AI_ENABLED is unset or false', async () => {
      delete process.env.LIVE_AI_ENABLED;

      await expect(
        GeminiFeedbackService.generateLiveDraft({ fixtureId: ALLOWLISTED_FIXTURE_ID })
      ).rejects.toThrow('Live Gemini generation is disabled by configuration (LIVE_AI_ENABLED=false)');
    });

    it('rejects live AI call if LIVE_AI_ENABLED is explicitly false', async () => {
      process.env.LIVE_AI_ENABLED = 'false';

      await expect(
        GeminiFeedbackService.generateLiveDraft({ fixtureId: ALLOWLISTED_FIXTURE_ID })
      ).rejects.toThrow('LIVE_AI_ENABLED=false');
    });

    it('rejects arbitrary fixture IDs even if LIVE_AI_ENABLED is true', async () => {
      process.env.LIVE_AI_ENABLED = 'true';

      await expect(
        GeminiFeedbackService.generateLiveDraft({ fixtureId: 'ARBITRARY_FIXTURE_001' })
      ).rejects.toThrow('Unauthorized fixture ID: "ARBITRARY_FIXTURE_001"');
    });

    it('rejects missing fixture ID even if LIVE_AI_ENABLED is true', async () => {
      process.env.LIVE_AI_ENABLED = 'true';

      await expect(
        GeminiFeedbackService.generateLiveDraft({ fixtureId: '' })
      ).rejects.toThrow('Unauthorized fixture ID');
    });

    it('fails safely if GEMINI_API_KEY is not configured on backend', async () => {
      process.env.LIVE_AI_ENABLED = 'true';
      delete process.env.GEMINI_API_KEY;

      await expect(
        GeminiFeedbackService.generateLiveDraft({ fixtureId: ALLOWLISTED_FIXTURE_ID })
      ).rejects.toThrow('GEMINI_API_KEY is not configured');
    });
  });

  describe('Response Validation & Prompt Structure', () => {
    it('validates and tags matching quotes against source synthetic reviewers', () => {
      const mockRawSections = [
        {
          id: 'team',
          title: 'FEEDBACK ON TEAM',
          summary: 'Solid scientific bench competency.',
          quotes: [
            {
              reviewerName: 'Dr. Alistair Finch',
              reviewerRole: 'Senior Bioprocess Engineer',
              quote: 'Dr. Elena Vance exhibits deep molecular biology domain knowledge.',
              categoryKey: 'team',
            },
          ],
        },
        {
          id: 'overall',
          title: 'OVERALL FEEDBACK',
          summary: 'Overall promising.',
          quotes: [],
        },
      ];

      const validated = validateSynthesizedResponse(mockRawSections, SYNTHETIC_SOLARIS_REVIEWERS);
      expect(validated).toHaveLength(2);

      const teamSec = validated.find((s) => s.id === 'team');
      expect(teamSec?.quoteRefs).toHaveLength(1);
      expect(teamSec?.quoteRefs?.[0].verificationStatus).toBe('verified');
      expect(teamSec?.quoteRefs?.[0].reviewerId).toBe('synthetic_af');
    });

    it('tags invented reviewer references as unverified', () => {
      const mockRawSections = [
        {
          id: 'team',
          title: 'FEEDBACK ON TEAM',
          summary: 'Invented feedback.',
          quotes: [
            {
              reviewerName: 'Invented Phantom Reviewer',
              reviewerRole: 'Auditor',
              quote: 'Invented quote statement.',
              categoryKey: 'team',
            },
          ],
        },
      ];

      const validated = validateSynthesizedResponse(mockRawSections, SYNTHETIC_SOLARIS_REVIEWERS);
      expect(validated[0].quoteRefs?.[0].verificationStatus).toBe('unverified');
    });

    it('tags fabricated quote text attributed to a real reviewer as unverified', () => {
      const mockRawSections = [
        {
          id: 'team',
          title: 'FEEDBACK ON TEAM',
          summary: 'Summary with fabricated quote.',
          quotes: [
            {
              reviewerName: 'Dr. Alistair Finch',
              reviewerRole: 'Senior Bioprocess Engineer',
              quote: 'This quote was never written by Dr. Alistair Finch in any scorecard.',
              categoryKey: 'team',
            },
          ],
        },
      ];

      const validated = validateSynthesizedResponse(mockRawSections, SYNTHETIC_SOLARIS_REVIEWERS);
      expect(validated[0].quoteRefs?.[0].verificationStatus).toBe('unverified');
    });

    it('throws error if response includes unknown section id', () => {
      const mockRawSections = [
        {
          id: 'unknown_section_category',
          title: 'UNKNOWN',
          summary: 'Bad section.',
          quotes: [],
        },
      ];

      expect(() =>
        validateSynthesizedResponse(mockRawSections, SYNTHETIC_SOLARIS_REVIEWERS)
      ).toThrow('Invalid section id in AI response');
    });

    it('buildSynthesisPrompt formats Nancy 5 sections and includes submitted reviewer details', () => {
      const prompt = buildSynthesisPrompt();
      expect(prompt).toContain("Nancy's standardized 5-section Feedback Summary");
      expect(prompt).toContain('OVERALL FEEDBACK');
      expect(prompt).toContain('FEEDBACK ON TEAM');
      expect(prompt).toContain('FEEDBACK ON VALUE PROPOSITION');
      expect(prompt).toContain('FEEDBACK ON ABI FIT');
      expect(prompt).toContain('FEEDBACK ON RISK');
      expect(prompt).toContain('Solaris Biotherapeutics');
    });
  });
});
