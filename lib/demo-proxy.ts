import { NextRequest } from 'next/server'
import { checkDemoRateLimit } from './demo-rate-limit'
import { getClientIp } from './client-ip'
import { errorResponse } from './response'

/**
 * Demo proxy handler for Pattern B demo auth.
 * Server-side proxy that makes API calls with demo API key.
 * Prevents demo keys from being exposed to client-side code.
 */

export async function makeDemoApiCall(
  request: NextRequest,
  endpoint: string,
  body: object
): Promise<Response> {
  // Get client IP for rate limiting
  const clientIp = getClientIp(request.headers)

  // Check demo rate limits
  const rateLimitResult = await checkDemoRateLimit(clientIp)

  if (!rateLimitResult.allowed) {
    return errorResponse(
      'RATE_LIMIT_EXCEEDED',
      'Demo rate limit exceeded. Please try again later.',
      429,
      {
        remaining_credits: rateLimitResult.remaining,
      }
    )
  }

  // Get demo API key from server environment (never exposed to client)
  const demoApiKey = process.env.DEMO_API_KEY
  if (!demoApiKey) {
    return errorResponse(
      'INTERNAL_ERROR',
      'Demo API key not configured',
      500
    )
  }

  try {
    // Make internal API call with demo credentials
    const apiUrl = new URL(endpoint, request.url)

    const apiResponse = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': demoApiKey,
      },
      body: JSON.stringify(body),
    })

    const responseData = await apiResponse.json()

    // Return the API response, but with updated rate limit info
    if (responseData.meta) {
      responseData.meta.remaining_credits = rateLimitResult.remaining
    }

    return new Response(JSON.stringify(responseData), {
      status: apiResponse.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Demo API call failed:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Demo API call failed',
      500
    )
  }
}