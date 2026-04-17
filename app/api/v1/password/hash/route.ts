import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateBcryptCost, sanitizeStringInput } from '@/lib/input-limits'
import { hashPassword } from '@/lib/crypto/password'
import { CRYPTO_LIMITS } from '@/lib/config'

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
    const cost = body.cost || 10

    if (!password) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "password" parameter',
        400,
        { request_id: requestId }
      )
    }

    // Validate bcrypt cost
    const costValidation = validateBcryptCost(cost)
    if (!costValidation.isValid) {
      return errorResponse(
        'INVALID_BCRYPT_COST',
        costValidation.error!,
        400,
        { request_id: requestId }
      )
    }

    // Hash password
    const result = await hashPassword(password, cost)

    const processingTime = Date.now() - startTime

    // Warning for high cost values that might timeout
    let warning: string | undefined
    if (cost > 12) {
      warning = `High cost value (${cost}) may cause timeouts on cold starts`
    }

    const response = {
      hash: result.hash,
      algorithm: result.algorithm,
      cost: result.cost,
      ...(warning && { warning })
    }

    return successResponse(response, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('Password hash API error:', error)

    // Check if this is a timeout error
    if (error instanceof Error && error.message.includes('timeout')) {
      return errorResponse(
        'INTERNAL_ERROR',
        'Password hashing timed out. Try a lower cost value.',
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