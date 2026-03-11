// ─── Stale-While-Revalidate In-Memory Cache ───
// Works on Vercel (no Redis needed)

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    isRevalidating: boolean;
}

const cache = new Map<string, CacheEntry<unknown>>();

const STALE_TIME = 60_000;       // 1 min — fresh
const MAX_AGE = 5 * 60_000;      // 5 min — stale but served
const HARD_EXPIRE = 15 * 60_000; // 15 min — force recompute

export async function cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>
): Promise<T> {
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    const now = Date.now();

    // 1. Cache miss or hard-expired → compute synchronously
    if (!entry || now - entry.timestamp > HARD_EXPIRE) {
        const data = await queryFn();
        cache.set(key, { data, timestamp: now, isRevalidating: false });
        return data;
    }

    // 2. Stale but not expired → return cached + revalidate in background
    if (now - entry.timestamp > STALE_TIME && !entry.isRevalidating) {
        entry.isRevalidating = true;
        queryFn()
            .then((data) => {
                cache.set(key, { data, timestamp: Date.now(), isRevalidating: false });
            })
            .catch((err) => {
                console.error(`Cache revalidation failed for ${key}:`, err);
                entry.isRevalidating = false;
            });
    }

    // 3. Return cached data
    return entry.data;
}

export function invalidateCache(keyPrefix?: string) {
    if (keyPrefix) {
        for (const key of cache.keys()) {
            if (key.startsWith(keyPrefix)) cache.delete(key);
        }
    } else {
        cache.clear();
    }
}
