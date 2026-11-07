import { GoogleGenAI, Type } from '@google/genai';
import {
  ALLOWLISTED_FIXTURE_ID,
  SYNTHETIC_SOLARIS_COMPANY,
  SYNTHETIC_SOLARIS_REVIEWERS,
  SYNTHETIC_NANCY_FEEDBACK_SECTIONS,
  SYNTHETIC_SOLARIS_CHECKIN_FEEDBACK_SECTIONS,
} from './fixtures/syntheticFixture';
import { FeedbackSectionData, ValidatedQuoteRef } from '../src/types';
import { findMatchingSourceField } from '../src/utils/quoteProvenance';

export { ALLOWLISTED_FIXTURE_ID };

export interface GenerationRequest {
  fixtureId: string;
  correlationToken?: {
    companyId: string;
    meetingId: string;
    editRevision?: number;
  };
}

export interface GenerationResult {
  mode: 'live_gemini' | 'demo_synthetic';
  sections: FeedbackSectionData[];
  metadata: {
    fixtureId: string;
    model: string;
    generatedAt: string;
    verifiedQuoteCount: number;
    disclaimer: string;
  };
}

/**
 * Structured schema for Gemini output.
 */
export const FEEDBACK_SUMMARY_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sections: {
      type: Type.ARRAY,
      description: "Nancy's 5 feedback sections: Overall Feedback, Team, Value Proposition, ABI Fit, Risk",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "Section identifier: 'overall', 'team', 'value_prop', 'abi_fit', or 'risk'",
          },
          title: {
            type: Type.STRING,
            description: "Section title, e.g. 'OVERALL FEEDBACK' or 'FEEDBACK ON TEAM'",
          },
          summary: {
            type: Type.STRING,
            description: '1 to 3 paragraph synthesized committee consensus summary.',
          },
          quotes: {
            type: Type.ARRAY,
            description: 'Verbatim quotes extracted from submitted scorecards.',
            items: {
              type: Type.OBJECT,
              properties: {
                reviewerName: { type: Type.STRING },
                reviewerRole: { type: Type.STRING },
                quote: { type: Type.STRING },
                categoryKey: { type: Type.STRING },
              },
              required: ['reviewerName', 'reviewerRole', 'quote'],
            },
          },
        },
        required: ['id', 'title', 'summary', 'quotes'],
      },
    },
  },
  required: ['sections'],
};

/**
 * Validates synthesized response against server-side synthetic source records.
 * Rejects invented references and tags valid quotes.
 */
export const validateSynthesizedResponse = (
  rawSections: any[],
  sourceReviewers = SYNTHETIC_SOLARIS_REVIEWERS
): FeedbackSectionData[] => {
  if (!Array.isArray(rawSections)) {
    throw new Error('Invalid AI response: sections must be an array.');
  }

  const validSectionIds = new Set(['overall', 'team', 'value_prop', 'abi_fit', 'risk']);

  return rawSections.map((sec) => {
    const sectionId = String(sec.id || '').toLowerCase();
    if (!validSectionIds.has(sectionId)) {
      throw new Error(`Invalid section id in AI response: ${sectionId}`);
    }

    const rawQuotes: any[] = Array.isArray(sec.quotes) ? sec.quotes : [];
    const validatedQuoteRefs: ValidatedQuoteRef[] = [];
    const stringQuotes: string[] = [];

    rawQuotes.forEach((q, idx) => {
      const quoteText = String(q.quote || '').trim();
      const reviewerName = String(q.reviewerName || '').trim();
      if (!quoteText) return;

      // Match against source reviewers and verify quote text exists in source scorecard
      const matchedRev = sourceReviewers.find(
        (r) => r.name.toLowerCase() === reviewerName.toLowerCase()
      );
      const sourceField = matchedRev ? findMatchingSourceField(matchedRev, quoteText) : undefined;

      if (matchedRev && sourceField) {
        validatedQuoteRefs.push({
          id: `ai_quote_${sectionId}_${idx}`,
          quote: quoteText,
          reviewerId: matchedRev.id,
          reviewerName: matchedRev.name,
          reviewerRole: matchedRev.role || matchedRev.title || 'Steering Committee',
          reviewerInitials: matchedRev.initials,
          score: matchedRev.categoryRatings?.[q.categoryKey] || undefined,
          categoryKey: q.categoryKey || (sectionId as any),
          sourceField,
          verificationStatus: 'verified',
        });
        stringQuotes.push(quoteText);
      } else {
        // Tag unverified reference if author was not found or quote text was not in source scorecards
        validatedQuoteRefs.push({
          id: `ai_quote_${sectionId}_${idx}`,
          quote: quoteText,
          reviewerId: matchedRev?.id || 'unknown',
          reviewerName: matchedRev?.name || reviewerName || 'Review Committee',
          reviewerRole: matchedRev?.role || matchedRev?.title || String(q.reviewerRole || 'Reviewer'),
          reviewerInitials: matchedRev?.initials,
          verificationStatus: 'unverified',
        });
        stringQuotes.push(quoteText);
      }
    });

    return {
      id: sectionId,
      title: String(sec.title || sectionId.toUpperCase()),
      prompt: String(sec.prompt || ''),
      summary: String(sec.summary || '').trim(),
      quotes: stringQuotes,
      quoteRefs: validatedQuoteRefs,
      categoryScoreKey: (sectionId === 'overall' ? undefined : sectionId === 'value_prop' ? 'market' : sectionId === 'abi_fit' ? 'fit' : sectionId) as any,
    };
  });
};

/**
 * Builds the strict, instruction-tuned prompt for Gemini synthesis.
 */
export const buildSynthesisPrompt = (
  company = SYNTHETIC_SOLARIS_COMPANY,
  reviewers = SYNTHETIC_SOLARIS_REVIEWERS
): string => {
  const reviewerSummaries = reviewers.map((r) => ({
    name: r.name,
    title: r.title,
    role: r.role,
    categoryRatings: r.categoryRatings,
    sectionComments: r.sectionComments,
    notes: r.notes,
    keyStrengths: r.keyStrengths,
    supportNeeded: r.supportNeeded,
    overallSummary: r.overallSummary,
    recommendation: r.recommendation,
  }));

  return `You are Nancy Lyon, Director and Lead Facilitator of the ACC Bioscience Incubator (ABI) Steering Committee.
Your task is to synthesize submitted committee review scorecards for a candidate company into Nancy's standardized 5-section Feedback Summary:
1. OVERALL FEEDBACK (id: 'overall')
2. FEEDBACK ON TEAM (id: 'team')
3. FEEDBACK ON VALUE PROPOSITION (id: 'value_prop')
4. FEEDBACK ON ABI FIT (id: 'abi_fit')
5. FEEDBACK ON RISK (id: 'risk')

CRITICAL REQUIREMENTS:
- Synthesize realistic, balanced, professional feedback suitable for an incubation steering committee.
- Preserve actual reviewer quotes VERBATIM from the reviewer notes, section comments, strengths, and support fields.
- DO NOT invent quotes, names, or reviewer roles. Sourced quotes must exactly match statements provided below.
- Do not compute or invent numeric averages.

COMPANY UNDER REVIEW:
Name: ${company.name}
Domain: ${company.domain}
Cohort: ${company.cohort}
Review Date: ${company.reviewDate}

SUBMITTED REVIEWER SCORECARDS:
${JSON.stringify(reviewerSummaries, null, 2)}
`;
};

/**
 * Service to execute Gemini synthesis when enabled, or return deterministic demo draft.
 */
export class GeminiFeedbackService {
  /**
   * Deterministic Demo Draft generator (never requires API key or network).
   */
  public static generateDemoDraft(
    fixtureId = ALLOWLISTED_FIXTURE_ID,
    meetingId?: string
  ): GenerationResult {
    if (fixtureId !== ALLOWLISTED_FIXTURE_ID) {
      throw new Error(`Unknown fixture ID: ${fixtureId}. Only ${ALLOWLISTED_FIXTURE_ID} is supported.`);
    }

    const templateSections =
      meetingId === 'solaris_checkin_q2'
        ? SYNTHETIC_SOLARIS_CHECKIN_FEEDBACK_SECTIONS
        : SYNTHETIC_NANCY_FEEDBACK_SECTIONS;

    const clonedSections: FeedbackSectionData[] = templateSections.map((sec) => ({
      ...sec,
      quotes: [...(sec.quotes || [])],
      quoteRefs: (sec.quoteRefs || []).map((qr) => ({ ...qr })),
    }));

    return {
      mode: 'demo_synthetic',
      sections: clonedSections,
      metadata: {
        fixtureId: ALLOWLISTED_FIXTURE_ID,
        model: 'deterministic-synthetic-mock',
        generatedAt: new Date().toISOString(),
        verifiedQuoteCount: clonedSections.reduce(
          (acc, sec) => acc + (sec.quoteRefs?.length || 0),
          0
        ),
        disclaimer:
          'Generated via Demo Mode · Deterministic Synthetic Response (Live AI Disabled). Data is sourced exclusively from dedicated synthetic fixture.',
      },
    };
  }

  /**
   * Live Gemini Generation.
   * Strictly gated:
   * 1. Requires LIVE_AI_ENABLED === 'true'
   * 2. Requires allowlisted fixtureId
   * 3. Requires valid GEMINI_API_KEY
   */
  public static async generateLiveDraft(request: GenerationRequest): Promise<GenerationResult> {
    // Safety check 1: Live AI calls disabled by default
    if (process.env.LIVE_AI_ENABLED !== 'true') {
      const err = new Error(
        'Live Gemini generation is disabled by configuration (LIVE_AI_ENABLED=false). Initial live testing requires explicit authorization and allowlisted synthetic fixture.'
      );
      (err as any).statusCode = 403;
      throw err;
    }

    // Safety check 2: Allowlisted fixture ID only; reject arbitrary browser text
    if (!request.fixtureId || request.fixtureId !== ALLOWLISTED_FIXTURE_ID) {
      const err = new Error(
        `Unauthorized fixture ID: "${request.fixtureId}". The backend strictly loads allowlisted synthetic fixtures (${ALLOWLISTED_FIXTURE_ID}) and rejects arbitrary payloads.`
      );
      (err as any).statusCode = 403;
      throw err;
    }

    // Safety check 3: API Key presence
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const err = new Error('GEMINI_API_KEY is not configured on the local backend server.');
      (err as any).statusCode = 500;
      throw err;
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildSynthesisPrompt(SYNTHETIC_SOLARIS_COMPANY, SYNTHETIC_SOLARIS_REVIEWERS);

    const modelName = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: FEEDBACK_SUMMARY_RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned empty response.');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('Failed to parse Gemini structured JSON response.');
    }

    const validatedSections = validateSynthesizedResponse(
      parsed.sections,
      SYNTHETIC_SOLARIS_REVIEWERS
    );

    return {
      mode: 'live_gemini',
      sections: validatedSections,
      metadata: {
        fixtureId: request.fixtureId,
        model: modelName,
        generatedAt: new Date().toISOString(),
        verifiedQuoteCount: validatedSections.reduce(
          (acc, sec) => acc + (sec.quoteRefs?.length || 0),
          0
        ),
        disclaimer:
          'Generated via Live Gemini Service using validated server-side synthetic fixture.',
      },
    };
  }
}
