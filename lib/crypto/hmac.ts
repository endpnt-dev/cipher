import { createHmac, timingSafeEqual } from 'crypto'
import { HmacAlgorithm, HMAC_ALGORITHMS } from '../config'

export interface HmacResult {
  hmac: string
  algorithm: HmacAlgorithm
  input_length: number
}

export interface HmacVerifyResult {
  valid: boolean
  algorithm: HmacAlgorithm
  input_length: number
}

export function isValidHmacAlgorithm(algorithm: string): algorithm is HmacAlgorithm {
  return HMAC_ALGORITHMS.includes(algorithm as HmacAlgorithm)
}

export function computeHmac(data: string | Buffer, secret: string | Buffer, algorithm: HmacAlgorithm): HmacResult {
  if (!isValidHmacAlgorithm(algorithm)) {
    throw new Error(`Unsupported HMAC algorithm: ${algorithm}`)
  }

  // Convert inputs to buffers for consistent handling
  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  const secretBuffer = Buffer.isBuffer(secret) ? secret : Buffer.from(secret, 'utf8')

  // Create HMAC
  const hmac = createHmac(algorithm, secretBuffer)
  hmac.update(dataBuffer)
  const result = hmac.digest('hex')

  return {
    hmac: result,
    algorithm,
    input_length: dataBuffer.length
  }
}

export function computeHmacBase64(data: string | Buffer, secret: string | Buffer, algorithm: HmacAlgorithm): string {
  if (!isValidHmacAlgorithm(algorithm)) {
    throw new Error(`Unsupported HMAC algorithm: ${algorithm}`)
  }

  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  const secretBuffer = Buffer.isBuffer(secret) ? secret : Buffer.from(secret, 'utf8')

  const hmac = createHmac(algorithm, secretBuffer)
  hmac.update(dataBuffer)
  return hmac.digest('base64')
}

export function verifyHmac(
  data: string | Buffer,
  secret: string | Buffer,
  providedHmac: string,
  algorithm: HmacAlgorithm
): HmacVerifyResult {
  if (!isValidHmacAlgorithm(algorithm)) {
    throw new Error(`Unsupported HMAC algorithm: ${algorithm}`)
  }

  try {
    // Compute the expected HMAC
    const expectedHmac = computeHmac(data, secret, algorithm).hmac

    // Use timing-safe comparison to prevent timing attacks
    const providedBuffer = Buffer.from(providedHmac, 'hex')
    const expectedBuffer = Buffer.from(expectedHmac, 'hex')

    // Buffers must be same length for timingSafeEqual
    if (providedBuffer.length !== expectedBuffer.length) {
      return {
        valid: false,
        algorithm,
        input_length: Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8')
      }
    }

    const isValid = timingSafeEqual(providedBuffer, expectedBuffer)

    return {
      valid: isValid,
      algorithm,
      input_length: Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8')
    }

  } catch (error) {
    // Any error in computation means verification failed
    return {
      valid: false,
      algorithm,
      input_length: Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8')
    }
  }
}