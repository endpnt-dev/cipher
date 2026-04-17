import jwt from 'jsonwebtoken'
import { JwtAlgorithm, JWT_ALGORITHMS } from '../config'

export interface JwtSignResult {
  token: string
  algorithm: JwtAlgorithm
  expires_at?: number
}

export interface JwtVerifyResult {
  valid: boolean
  payload?: jwt.JwtPayload | string
  algorithm?: JwtAlgorithm
  expires_at?: number
  issued_at?: number
  error?: string
}

export interface JwtDecodeResult {
  header?: jwt.JwtHeader
  payload?: jwt.JwtPayload | string
  algorithm?: string
  expires_at?: number
  issued_at?: number
}

export function isValidJwtAlgorithm(algorithm: string): algorithm is JwtAlgorithm {
  // Explicitly reject 'none' algorithm for security
  if (algorithm === 'none') {
    return false
  }
  return JWT_ALGORITHMS.includes(algorithm as JwtAlgorithm)
}

export function signJwt(
  payload: string | object,
  secret: string,
  algorithm: JwtAlgorithm,
  expiresIn?: string | number
): JwtSignResult {
  if (!isValidJwtAlgorithm(algorithm)) {
    throw new Error(`Unsupported or insecure JWT algorithm: ${algorithm}`)
  }

  if (!secret || secret.length === 0) {
    throw new Error('JWT secret cannot be empty')
  }

  // The algorithm check is already done in isValidJwtAlgorithm above

  try {
    const options: jwt.SignOptions = {
      algorithm
    }

    if (expiresIn) {
      options.expiresIn = expiresIn as jwt.SignOptions['expiresIn']
    }

    const token = jwt.sign(payload, secret, options)

    // Calculate expiration timestamp if expiresIn was provided
    let expiresAt: number | undefined
    if (expiresIn) {
      const decoded = jwt.decode(token, { complete: true }) as jwt.Jwt
      if (decoded?.payload && typeof decoded.payload === 'object' && decoded.payload.exp) {
        expiresAt = decoded.payload.exp
      }
    }

    return {
      token,
      algorithm,
      expires_at: expiresAt
    }
  } catch (error) {
    throw new Error(`Failed to sign JWT: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function verifyJwt(
  token: string,
  secret: string,
  algorithms?: JwtAlgorithm[]
): JwtVerifyResult {
  if (!token || token.length === 0) {
    return {
      valid: false,
      error: 'Token cannot be empty'
    }
  }

  if (!secret || secret.length === 0) {
    return {
      valid: false,
      error: 'Secret cannot be empty'
    }
  }

  // Default to all supported algorithms if not specified
  const allowedAlgorithms = algorithms || JWT_ALGORITHMS

  // Ensure no insecure algorithms are allowed
  const secureAlgorithms = allowedAlgorithms.filter((alg: string) => alg !== 'none' && JWT_ALGORITHMS.includes(alg as JwtAlgorithm)) as JwtAlgorithm[]

  if (secureAlgorithms.length === 0) {
    return {
      valid: false,
      error: 'No secure algorithms specified'
    }
  }

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: secureAlgorithms
    })

    // Get algorithm from token header
    const decoded = jwt.decode(token, { complete: true }) as jwt.Jwt
    const algorithm = decoded?.header?.alg as JwtAlgorithm

    let expiresAt: number | undefined
    let issuedAt: number | undefined

    if (typeof payload === 'object' && payload !== null) {
      expiresAt = payload.exp
      issuedAt = payload.iat
    }

    return {
      valid: true,
      payload,
      algorithm,
      expires_at: expiresAt,
      issued_at: issuedAt
    }
  } catch (error) {
    let errorMessage = 'Invalid token'

    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token has expired'
    } else if (error instanceof jwt.JsonWebTokenError) {
      if (error.message.includes('signature')) {
        errorMessage = 'Invalid token signature'
      } else if (error.message.includes('audience')) {
        errorMessage = 'Invalid token audience'
      } else if (error.message.includes('issuer')) {
        errorMessage = 'Invalid token issuer'
      } else {
        errorMessage = error.message
      }
    }

    return {
      valid: false,
      error: errorMessage
    }
  }
}

export function decodeJwt(token: string): JwtDecodeResult {
  if (!token || token.length === 0) {
    return {}
  }

  try {
    const decoded = jwt.decode(token, { complete: true })

    if (!decoded) {
      return {}
    }

    let expiresAt: number | undefined
    let issuedAt: number | undefined

    if (decoded.payload && typeof decoded.payload === 'object') {
      expiresAt = decoded.payload.exp
      issuedAt = decoded.payload.iat
    }

    return {
      header: decoded.header,
      payload: decoded.payload,
      algorithm: decoded.header.alg,
      expires_at: expiresAt,
      issued_at: issuedAt
    }
  } catch {
    return {}
  }
}

export function isJwtExpired(token: string): boolean {
  try {
    const decoded = decodeJwt(token)
    if (decoded.expires_at) {
      return Date.now() / 1000 > decoded.expires_at
    }
    return false
  } catch {
    return true
  }
}