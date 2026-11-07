import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { GeminiFeedbackService, ALLOWLISTED_FIXTURE_ID } from './geminiService';

// Load local environment variables from .env if present
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = '127.0.0.1'; // Strictly bound to localhost; unreachable from network

// Security: Enforce 100kb request size limit
app.use(express.json({ limit: '100kb' }));

// Middleware: Confidentiality-preserving logging (excludes company, founder, and review text)
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  // Strictly log HTTP method, path, and sanitized metadata; NEVER log payload body content
  console.log(`[${timestamp}] [AI Backend] ${req.method} ${req.path} (Client: ${req.ip})`);
  next();
});

// Health & Status endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ABI Local Evaluation Backend',
    liveAiEnabled: process.env.LIVE_AI_ENABLED === 'true',
    supportedFixtures: [ALLOWLISTED_FIXTURE_ID],
    timestamp: new Date().toISOString(),
  });
});

// Demo Generation Endpoint (Deterministic Synthetic Response)
app.post('/api/ai/demo-draft', (req: Request, res: Response) => {
  try {
    const fixtureId = req.body?.fixtureId || ALLOWLISTED_FIXTURE_ID;
    const meetingId = req.body?.correlationToken?.meetingId;
    const result = GeminiFeedbackService.generateDemoDraft(fixtureId, meetingId);
    res.json({
      success: true,
      ...result,
      correlationToken: req.body?.correlationToken,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to generate demo synthetic draft',
    });
  }
});

// Live AI Generation Endpoint (Strictly Gated)
app.post('/api/ai/synthesize-draft', async (req: Request, res: Response) => {
  try {
    // Reject request if live calls are disabled
    if (process.env.LIVE_AI_ENABLED !== 'true') {
      return res.status(403).json({
        success: false,
        error:
          'Live AI generation is disabled (LIVE_AI_ENABLED=false). Initial live testing requires explicit authorization and allowlisted synthetic fixture.',
        mode: 'disabled',
      });
    }

    // Reject arbitrary payload or non-allowlisted fixture ID
    const fixtureId = req.body?.fixtureId;
    if (!fixtureId || fixtureId !== ALLOWLISTED_FIXTURE_ID) {
      return res.status(403).json({
        success: false,
        error: `Unauthorized fixture ID: "${fixtureId}". The backend strictly loads allowlisted synthetic fixtures (${ALLOWLISTED_FIXTURE_ID}) and rejects arbitrary payloads.`,
      });
    }

    const result = await GeminiFeedbackService.generateLiveDraft({
      fixtureId,
      correlationToken: req.body?.correlationToken,
    });

    res.json({
      success: true,
      ...result,
      correlationToken: req.body?.correlationToken,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      success: false,
      error: error.message || 'Internal error during draft synthesis',
    });
  }
});

// Start listening if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, () => {
    console.log(`[AI Backend] Server listening at http://${HOST}:${PORT}`);
    console.log(`[AI Backend] Live AI calls: ${process.env.LIVE_AI_ENABLED === 'true' ? 'ENABLED' : 'DISABLED (default)'}`);
  });
}

export default app;
