import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeStringInput } from '@/lib/input-limits'
import { verifyPassword } from '@/lib/crypto/password'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = generateRequestId()

  try {
    // Authenticate request
    const apiKey = getApiKeyFromHeaders(request.headers)
    const keyInfo = validateApiKey(apiKey)

    if (!keyInfo) {
      return errorResponse(
        'AUTH_REQUIRED',
        getErrorMessage('AUTH_REQUIRED'),
        401,
        { request_id: requestId }
      )
    }

    // Check rate limits
    const rateLimitResult = await checkRateLimit(apiKey!, keyInfo.tier)
    if (!rateLimitResult.allowed) {
      return errorResponse(
        'RATE_LIMIT_EXCEEDED',
        getErrorMessage('RATE_LIMIT_EXCEEDED'),
        429,
        {
          request_id: requestId,
          remaining_credits: rateLimitResult.remaining
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()

    const password = sanitizeStringInput(body.password)
    const hash = sanitizeStringInput(body.hash)

    if (!password) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "password" parameter',
        400,
        { request_id: requestId }
      )
    }

    if (!hash) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "hash" parameter',
        400,
        { request_id: requestId }
      )
    }

    // Verify password
    const result = await verifyPassword(password, hash)

    const processingTime = Date.now() - startTime

    return successResponse(result, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('Password verify API error:', error)

    // Check if this is a timeout error
    if (error instanceof Error && error.message.includes('timeout')) {
      return errorResponse(
        'INTERNAL_ERROR',
        'Password verification timed out.',
        408,
        { request_id: requestId }
      )
    }

    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}