export function createRateLimiter({ limit = 30, windowMs = 60_000, now = Date.now } = {}) {
  const requestsByIp = new Map();

  return function rateLimit(request, response, next) {
    const currentTime = now();
    for (const [ip, entry] of requestsByIp) {
      if (currentTime - entry.startedAt >= windowMs) requestsByIp.delete(ip);
    }

    const ip = request.ip || request.socket?.remoteAddress || 'unknown';
    const entry = requestsByIp.get(ip);
    if (!entry || currentTime - entry.startedAt >= windowMs) {
      requestsByIp.set(ip, { startedAt: currentTime, count: 1 });
      return next();
    }
    if (entry.count >= limit) {
      return response.status(429).json({ error: 'Too many requests. Try again later.' });
    }
    entry.count += 1;
    return next();
  };
}
