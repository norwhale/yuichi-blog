type Bucket = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __medmentorRateLimitStore?: Map<string, Bucket>;
};

const store = globalStore.__medmentorRateLimitStore ?? new Map<string, Bucket>();
globalStore.__medmentorRateLimitStore = store;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    const nextBucket = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, nextBucket);
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
