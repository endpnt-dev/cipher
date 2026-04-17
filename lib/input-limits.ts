import { CRYPTO_LIMITS } from './config'

export interface InputValidationResult {
  isValid: boolean
  error?: string
}

export function validateInputSize(input: string | Buffer): InputValidationResult {
  const sizeInBytes = Buffer.isBuffer(input) ? input.length : Buffer.byteLength(input, 'utf8')
  const maxBytes = CRYPTO_LIMITS.input_max_mb * 1024 * 1024

  if (sizeInBytes > maxBytes) {
    return {
      isValid: false,
      error: `Input size ${Math.round(sizeInBytes / 1024)}KB exceeds maximum of ${CRYPTO_LIMITS.input_max_mb}MB`
    }
  }

  return { isValid: true }
}

export function validateBcryptCost(cost: number): InputValidationResult {
  if (!Number.isInteger(cost) || cost < CRYPTO_LIMITS.bcrypt_cost.min || cost > CRYPTO_LIMITS.bcrypt_cost.max) {
    return {
      isValid: false,
      error: `Bcrypt cost must be an integer between ${CRYPTO_LIMITS.bcrypt_cost.min} and ${CRYPTO_LIMITS.bcrypt_cost.max}`
    }
  }

  return { isValid: true }
}

export function validateJwtPayloadSize(payload: object): InputValidationResult {
  const payloadJson = JSON.stringify(payload)
  const sizeInBytes = Buffer.byteLength(payloadJson, 'utf8')
  const maxBytes = CRYPTO_LIMITS.jwt_max_payload_kb * 1024

  if (sizeInBytes > maxBytes) {
    return {
      isValid: false,
      error: `JWT payload size ${Math.round(sizeInBytes / 1024)}KB exceeds maximum of ${CRYPTO_LIMITS.jwt_max_payload_kb}KB`
    }
  }

  return { isValid: true }
}

export function sanitizeStringInput(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null
  }

  // Basic sanitization - remove null bytes and control characters except newlines
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}