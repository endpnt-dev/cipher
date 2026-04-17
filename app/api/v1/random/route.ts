import { NextRequest } from 'next/server'
import { successResponse, errorResponse, generateRequestId, getErrorMessage } from '@/lib/response'
import { validateApiKey, getApiKeyFromHeaders } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeStringInput } from '@/lib/input-limits'
import { generateRandomBytes, generateRandomString, isValidCharset } from '@/lib/crypto/random'
import { CHARSETS } from '@/lib/config'

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

    const type = sanitizeStringInput(body.type) || 'bytes'
    const length = body.length || 32

    // Validate length
    if (!Number.isInteger(length) || length <= 0 || length > 1024) {
      return errorResponse(
        'INVALID_PARAMS',
        'Length must be an integer between 1 and 1024',
        400,
        { request_id: requestId }
      )
    }

    let result: any

    if (type === 'bytes') {
      const encoding = sanitizeStringInput(body.encoding) || 'hex'

      if (encoding !== 'hex' && encoding !== 'base64') {
        return errorResponse(
          'INVALID_PARAMS',
          'Encoding must be "hex" or "base64"',
          400,
          { request_id: requestId }
        )
      }

      result = generateRandomBytes(length, encoding as 'hex' | 'base64')

    } else if (type === 'string') {
      const charset = sanitizeStringInput(body.charset) || 'alphanumeric'

      if (!isValidCharset(charset)) {
        return errorResponse(
          'INVALID_CHARSET',
          `Invalid charset. Supported: ${CHARSETS.join(', ')}`,
          400,
          { request_id: requestId }
        )
      }

      result = generateRandomString(length, charset)

    } else {
      return errorResponse(
        'INVALID_PARAMS',
        'Type must be "bytes" or "string"',
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
    console.error('Random API error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      getErrorMessage('INTERNAL_ERROR'),
      500,
      { request_id: requestId }
    )
  }
}