import bcrypt from 'bcryptjs'
import { CRYPTO_LIMITS } from '../config'

export interface PasswordHashResult {
  hash: string
  cost: number
  algorithm: 'bcrypt'
}

export interface PasswordVerifyResult {
  valid: boolean
  cost: number
  algorithm: 'bcrypt'
}

export async function hashPassword(password: string, cost: number = 10): Promise<PasswordHashResult> {
  // Validate cost parameter
  if (!Number.isInteger(cost) || cost < CRYPTO_LIMITS.bcrypt_cost.min || cost > CRYPTO_LIMITS.bcrypt_cost.max) {
    throw new Error(
      `Bcrypt cost must be an integer between ${CRYPTO_LIMITS.bcrypt_cost.min} and ${CRYPTO_LIMITS.bcrypt_cost.max}`
    )
  }

  // Validate password input
  if (typeof password !== 'string') {
    throw new Error('Password must be a string')
  }

  if (password.length === 0) {
    throw new Error('Password cannot be empty')
  }

  if (password.length > 72) {
    // bcrypt has a 72 byte limit on input
    throw new Error('Password cannot exceed 72 bytes')
  }

  try {
    const hash = await bcrypt.hash(password, cost)

    return {
      hash,
      cost,
      algorithm: 'bcrypt'
    }
  } catch (error) {
    throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function verifyPassword(password: string, hash: string): Promise<PasswordVerifyResult> {
  // Validate inputs
  if (typeof password !== 'string' || typeof hash !== 'string') {
    throw new Error('Password and hash must be strings')
  }

  if (password.length === 0) {
    throw new Error('Password cannot be empty')
  }

  if (password.length > 72) {
    throw new Error('Password cannot exceed 72 bytes')
  }

  // Validate hash format (basic bcrypt hash validation)
  if (!hash.startsWith('$2') || hash.length < 59) {
    return {
      valid: false,
      cost: 0,
      algorithm: 'bcrypt'
    }
  }

  try {
    // Extract cost from hash for response
    const cost = bcrypt.getRounds(hash)

    // Verify the password using constant-time comparison
    const isValid = await bcrypt.compare(password, hash)

    return {
      valid: isValid,
      cost,
      algorithm: 'bcrypt'
    }
  } catch (error) {
    // Any error in verification means the password is invalid
    return {
      valid: false,
      cost: 0,
      algorithm: 'bcrypt'
    }
  }
}

export function getBcryptCost(hash: string): number {
  try {
    return bcrypt.getRounds(hash)
  } catch {
    return 0
  }
}

export function isValidBcryptHash(hash: string): boolean {
  try {
    bcrypt.getRounds(hash)
    return true
  } catch {
    return false
  }
}

/**
 * Generate a salt for bcrypt hashing
 * This is mainly for educational purposes as bcrypt.hash() generates salt automatically
 */
export async function generateSalt(cost: number = 10): Promise<string> {
  if (!Number.isInteger(cost) || cost < CRYPTO_LIMITS.bcrypt_cost.min || cost > CRYPTO_LIMITS.bcrypt_cost.max) {
    throw new Error(
      `Bcrypt cost must be an integer between ${CRYPTO_LIMITS.bcrypt_cost.min} and ${CRYPTO_LIMITS.bcrypt_cost.max}`
    )
  }

  try {
    return await bcrypt.genSalt(cost)
  } catch (error) {
    throw new Error(`Failed to generate salt: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}