import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateJwtPayloadSize, sanitizeStringInput } from '@/lib/input-limits'
import { signJwt, isValidJwtAlgorithm } from '@/lib/crypto/jwt'
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

    const payload = body.payload
    const secret = sanitizeStringInput(body.secret)
    const algorithm = sanitizeStringInput(body.algorithm) || 'HS256'
    const expiresIn = body.expires_in

    if (!payload) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing "payload" parameter',
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

    // Validate algorithm - explicitly reject 'none' for security
    if (algorithm === 'none') {
      return errorResponse(
        'INVALID_PARAMS',
        'JWT "none" algorithm is not allowed for security reasons',
        400,
        { request_id: requestId }
      )
    }

    if (!isValidJwtAlgorithm(algorithm)) {
      return errorResponse(
        'UNSUPPORTED_ALGORITHM',
        `Unsupported algorithm. Supported: ${JWT_ALGORITHMS.join(', ')}`,
        400,
        { request_id: requestId }
      )
    }

    // Validate payload size if it's an object
    if (typeof payload === 'object') {
      const payloadValidation = validateJwtPayloadSize(payload)
      if (!payloadValidation.isValid) {
        return errorResponse(
          'INPUT_TOO_LARGE',
          payloadValidation.error!,
          400,
          { request_id: requestId }
        )
      }
    }

    // Sign JWT
    const result = signJwt(payload, secret, algorithm, expiresIn)

    const processingTime = Date.now() - startTime

    // Security: Don't echo back the secret in the response
    const response = {
      token: result.token,
      algorithm: result.algorithm,
      ...(result.expires_at && { expires_at: result.expires_at })
    }

    return successResponse(response, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('JWT sign API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}