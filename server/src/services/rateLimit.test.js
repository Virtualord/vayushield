import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter } from './rateLimit.js';

function responseRecorder() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

describe('in-memory per-IP rate limiter', () => {
  it('allows requests up to the limit and resets at the next window', () => {
    let currentTime = 100;
    const limit = createRateLimiter({ limit: 2, windowMs: 60_000, now: () => currentTime });
    const request = { ip: '127.0.0.1' };
    const next = vi.fn();

    limit(request, responseRecorder(), next);
    limit(request, responseRecorder(), next);
    const blocked = responseRecorder();
    limit(request, blocked, next);
    expect(blocked.statusCode).toBe(429);
    expect(next).toHaveBeenCalledTimes(2);

    currentTime += 60_000;
    limit(request, responseRecorder(), next);
    expect(next).toHaveBeenCalledTimes(3);
  });
});
