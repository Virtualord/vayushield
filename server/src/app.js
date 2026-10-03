import cors from 'cors';
import express from 'express';
import { generateActionPlan, generateExplanation } from './services/gemini.js';
import { analyzeRequest } from './services/analyzeRequest.js';
import { planRequest } from './services/planRequest.js';
import { createRateLimiter } from './services/rateLimit.js';

export function createApp({
  analyzeWithGemini = generateExplanation,
  planWithGemini = generateActionPlan,
  apiKeyProvider = () => process.env.GEMINI_API_KEY,
} = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.post('/api/analyze', createRateLimiter(), async (request, response) => {
    const outcome = await analyzeRequest(request.body, {
      apiKey: apiKeyProvider(),
      analyzeWithGemini,
    });
    return response.status(outcome.status).json(outcome.payload);
  });

  app.post('/api/plan', createRateLimiter(), async (request, response) => {
    const outcome = await planRequest(request.body, {
      apiKey: apiKeyProvider(),
      planWithGemini,
    });
    return response.status(outcome.status).json(outcome.payload);
  });

  app.use((error, _request, response, _next) => {
    if (error.type === 'entity.parse.failed') {
      return response.status(400).json({ error: 'Invalid JSON body' });
    }
    return response.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
