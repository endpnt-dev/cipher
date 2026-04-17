import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeStringInput } from '@/lib/input-limits'
import { generateUuid, isValidUuidVersion } from '@/lib/crypto/uuid'
import { UUID_VERSIONS } from '@/lib/config'

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

    const versionInput = body.version || 4

    // Validate version input
    if (!Number.isInteger(versionInput) || !isValidUuidVersion(versionInput)) {
      return errorResponse(
        'INVALID_UUID_VERSION',
        `Invalid UUID version. Supported versions: ${UUID_VERSIONS.join(', ')}`,
        400,
        { request_id: requestId }
      )
    }

    // Generate UUID
    const result = generateUuid(versionInput)

    const processingTime = Date.now() - startTime

    return successResponse(result, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('UUID API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow GET for simple UUID v4 generation
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

    // Generate UUID v4 by default
    const result = generateUuid(4)

    const processingTime = Date.now() - startTime

    return successResponse(result, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('UUID GET API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}