/* ═══════════════════════════════════════════════════
   Simple in-memory rate limiter (per IP)
   Works on Vercel serverless — resets on cold starts
   ═══════════════════════════════════════════════════ */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}, 5 * 60 * 1000);

/**
 * Check if a request should be rate-limited.
 * @param key   Unique key (usually IP + route)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns { limited: boolean, remaining: number }
 */
export function checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
): { limited: boolean; remaining: number } {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { limited: false, remaining: limit - 1 };
    }

    entry.count++;
    if (entry.count > limit) {
        return { limited: true, remaining: 0 };
    }

    return { limited: false, remaining: limit - entry.count };
}
