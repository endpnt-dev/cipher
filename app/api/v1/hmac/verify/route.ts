import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { validateInputSize, sanitizeStringInput } from '@/lib/input-limits'
import { verifyHmac, isValidHmacAlgorithm } from '@/lib/crypto/hmac'
import { HMAC_ALGORITHMS } from '@/lib/config'

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

    const data = sanitizeStringInput(body.data)
    const secret = sanitizeStringInput(body.secret)
    const hmac = sanitizeStringInput(body.hmac)
    const algorithm = sanitizeStringInput(body.algorithm) || 'sha256'

    if (!data) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "data" parameter',
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

    if (!hmac) {
      return errorResponse(
        'INVALID_PARAMS',
        'Missing or invalid "hmac" parameter',
        400,
        { request_id: requestId }
      )
    }

    // Validate algorithm
    if (!isValidHmacAlgorithm(algorithm)) {
      return errorResponse(
        'UNSUPPORTED_ALGORITHM',
        `Unsupported algorithm. Supported: ${HMAC_ALGORITHMS.join(', ')}`,
        400,
        { request_id: requestId }
      )
    }

    // Validate input size
    const dataValidation = validateInputSize(data)
    if (!dataValidation.isValid) {
      return errorResponse(
        'INPUT_TOO_LARGE',
        dataValidation.error!,
        400,
        { request_id: requestId }
      )
    }

    const secretValidation = validateInputSize(secret)
    if (!secretValidation.isValid) {
      return errorResponse(
        'INPUT_TOO_LARGE',
        'Secret ' + secretValidation.error!.toLowerCase(),
        400,
        { request_id: requestId }
      )
    }

    // Validate HMAC format (basic hex validation)
    if (!/^[0-9a-fA-F]+$/.test(hmac)) {
      return errorResponse(
        'INVALID_INPUT_FORMAT',
        'HMAC must be a valid hexadecimal string',
        400,
        { request_id: requestId }
      )
    }

    // Verify HMAC
    const result = verifyHmac(data, secret, hmac, algorithm)

    const processingTime = Date.now() - startTime

    return successResponse(result, {
      request_id: requestId,
      processing_ms: processingTime,
      remaining_credits: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('HMAC verify API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}