import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null
let demoRateLimit: Ratelimit | null = null

function initializeRedis() {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      console.warn('Redis credentials not found. Demo rate limiting disabled.')
      return null
    }

    redis = new Redis({
      url,
      token,
    })
  }
  return redis
}

function initializeDemoRateLimit() {
  if (!demoRateLimit) {
    const redisInstance = initializeRedis()
    if (!redisInstance) return null

    // More restrictive limits for demo usage
    demoRateLimit = new Ratelimit({
      redis: redisInstance,
      limiter: Ratelimit.slidingWindow(
        5,  // 5 requests per minute
        '1 m'
      ),
      analytics: true,
      prefix: 'rl:cipher:demo',
    })
  }
  return demoRateLimit
}

export interface DemoRateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
  limit: number
}

export async function checkDemoRateLimit(
  clientIp: string
): Promise<DemoRateLimitResult> {
  const limiter = initializeDemoRateLimit()

  if (!limiter) {
    // If Redis is not available, allow limited requests
    console.warn('Demo rate limiting disabled: Redis not available')
    return {
      allowed: true,
      remaining: 5,
      reset: Date.now() + 60000,
      limit: 5,
    }
  }

  try {
    const result = await limiter.limit(`demo:${clientIp}`)

    return {
      allowed: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    }
  } catch (error) {
    console.error('Demo rate limit check failed:', error)
    // On error, be restrictive for demos
    return {
      allowed: false,
      remaining: 0,
      reset: Date.now() + 60000,
      limit: 5,
    }
  }
}