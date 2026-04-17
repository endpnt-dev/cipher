import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeStringInput } from '@/lib/input-limits'
import { decodeJwt } from '@/lib/crypto/jwt'

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

    const token = sanitizeStringInput(body.token)

    if (!token) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "token" parameter',
        400,
        { request_id: requestId }
      )
    }

    // Decode JWT (without verification)
    const result = decodeJwt(token)

    // Check if decoding was successful
    if (!result.header && !result.payload) {
      return errorResponse(
        'INVALID_JWT',
        'Invalid JWT token format',
        400,
        { request_id: requestId }
      )
    }

    const processingTime = Date.now() - startTime

    return successResponse(result, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('JWT decode API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}