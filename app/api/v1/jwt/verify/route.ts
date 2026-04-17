import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeStringInput } from '@/lib/input-limits'
import { verifyJwt, isValidJwtAlgorithm } from '@/lib/crypto/jwt'
import { JWT_ALGORITHMS } from '@/lib/config'

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
    const secret = sanitizeStringInput(body.secret)
    const algorithms = body.algorithms

    if (!token) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "token" parameter',
        400,
        { request_id: requestId }
      )
    }

    if (!secret) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "secret" parameter',
        400,
        { request_id: requestId }
      )
    }

    // Validate algorithms if provided
    let allowedAlgorithms: any = undefined
    if (algorithms && Array.isArray(algorithms)) {
      // Filter out 'none' algorithm and validate each one
      allowedAlgorithms = algorithms.filter((alg: string) => {
        if (alg === 'none') return false
        return isValidJwtAlgorithm(alg)
      })

      if (allowedAlgorithms.length === 0) {
        return errorResponse(
          'INVALID_PARAMS',
          'No valid algorithms specified. "none" algorithm is not allowed.',
          400,
          { request_id: requestId }
        )
      }
    }

    // Verify JWT
    const result = verifyJwt(token, secret, allowedAlgorithms)

    const processingTime = Date.now() - startTime

    // Return appropriate error codes based on verification result
    if (!result.valid) {
      let errorCode = 'INVALID_JWT'
      let statusCode = 400

      if (result.error?.includes('expired')) {
        errorCode = 'JWT_EXPIRED'
        statusCode = 401
      } else if (result.error?.includes('signature')) {
        errorCode = 'JWT_INVALID_SIGNATURE'
        statusCode = 401
      } else if (result.error?.includes('issuer')) {
        errorCode = 'JWT_INVALID_ISSUER'
        statusCode = 401
      } else if (result.error?.includes('audience')) {
        errorCode = 'JWT_INVALID_AUDIENCE'
        statusCode = 401
      }

      return errorResponse(
        errorCode as any,
        result.error || getErrorMessage('INVALID_JWT'),
        statusCode,
        { request_id: requestId }
      )
    }

    return successResponse(result, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('JWT verify API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}