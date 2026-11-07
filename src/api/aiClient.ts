import { FeedbackSectionData } from '../types';
import {
  ALLOWLISTED_FIXTURE_ID,
  SYNTHETIC_NANCY_FEEDBACK_SECTIONS,
  SYNTHETIC_SOLARIS_CHECKIN_FEEDBACK_SECTIONS,
} from '../fixtures/syntheticFixture';

export interface GenerationResponse {
  success: boolean;
  mode: 'live_gemini' | 'demo_synthetic' | 'disabled';
  sections?: FeedbackSectionData[];
  metadata?: {
    fixtureId: string;
    model: string;
    generatedAt: string;
    verifiedQuoteCount: number;
    disclaimer: string;
  };
  correlationToken?: {
    companyId: string;
    meetingId: string;
    editRevision?: number;
  };
  error?: string;
}

export interface BackendHealthResponse {
  status: string;
  service: string;
  liveAiEnabled: boolean;
  supportedFixtures: string[];
}

export const checkBackendHealth = async (): Promise<BackendHealthResponse | null> => {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

/**
 * Request a synthetic demo draft (deterministic, never calls external services).
 */
export const requestDemoDraft = async (
  fixtureId: string,
  correlationToken: { companyId: string; meetingId: string; editRevision: number }
): Promise<GenerationResponse> => {
  try {
    const res = await fetch('/api/ai/demo-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixtureId, correlationToken }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Local backend not reachable; using in-memory deterministic synthetic fixture.');
  } catch (error: any) {
    if (fixtureId === ALLOWLISTED_FIXTURE_ID) {
      const template =
        correlationToken.meetingId === 'solaris_checkin_q2'
          ? SYNTHETIC_SOLARIS_CHECKIN_FEEDBACK_SECTIONS
          : SYNTHETIC_NANCY_FEEDBACK_SECTIONS;
      const cloned = template.map((sec) => ({
        ...sec,
        quotes: [...(sec.quotes || [])],
        quoteRefs: (sec.quoteRefs || []).map((qr) => ({ ...qr })),
      }));
      return {
        success: true,
        mode: 'demo_synthetic',
        sections: cloned,
        metadata: {
          fixtureId: ALLOWLISTED_FIXTURE_ID,
          model: 'deterministic-synthetic-mock',
          generatedAt: new Date().toISOString(),
          verifiedQuoteCount: cloned.reduce((acc, s) => acc + (s.quoteRefs?.length || 0), 0),
          disclaimer:
            'Generated via Demo Mode · Deterministic Synthetic Response (Live AI Disabled). Data is sourced exclusively from dedicated synthetic fixture.',
        },
        correlationToken,
      };
    }
    return {
      success: false,
      mode: 'demo_synthetic',
      error: error.message || 'Could not connect to local backend service on 127.0.0.1:3001',
    };
  }
};

/**
 * Request a live Gemini draft (strictly requires backend allowlisted fixture & LIVE_AI_ENABLED=true).
 */
export const requestLiveDraft = async (
  fixtureId: string,
  correlationToken: { companyId: string; meetingId: string; editRevision: number }
): Promise<GenerationResponse> => {
  try {
    const res = await fetch('/api/ai/synthesize-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fixtureId, correlationToken }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return {
      success: false,
      mode: 'disabled',
      error:
        'Live AI generation is disabled (LIVE_AI_ENABLED=false). Initial live testing requires explicit authorization and allowlisted synthetic fixture.',
    };
  } catch (error: any) {
    return {
      success: false,
      mode: 'disabled',
      error:
        'Live AI generation is disabled (LIVE_AI_ENABLED=false). Could not connect to local backend service on 127.0.0.1:3001.',
    };
  }
};
