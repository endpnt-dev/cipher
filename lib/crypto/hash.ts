import { createHash } from 'crypto'
import { HashAlgorithm, HASH_ALGORITHMS } from '../config'

export interface HashResult {
  hash: string
  algorithm: HashAlgorithm
  input_length: number
}

export function isValidHashAlgorithm(algorithm: string): algorithm is HashAlgorithm {
  return HASH_ALGORITHMS.includes(algorithm as HashAlgorithm)
}

export function computeHash(data: string | Buffer, algorithm: HashAlgorithm): HashResult {
  if (!isValidHashAlgorithm(algorithm)) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`)
  }

  // Convert string to buffer for consistent handling
  const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')

  // Create hash
  const hash = createHash(algorithm)
  hash.update(inputBuffer)
  const result = hash.digest('hex')

  return {
    hash: result,
    algorithm,
    input_length: inputBuffer.length
  }
}

export function computeHashBase64(data: string | Buffer, algorithm: HashAlgorithm): string {
  if (!isValidHashAlgorithm(algorithm)) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`)
  }

  const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  const hash = createHash(algorithm)
  hash.update(inputBuffer)
  return hash.digest('base64')
}

export function computeHashBuffer(data: string | Buffer, algorithm: HashAlgorithm): Buffer {
  if (!isValidHashAlgorithm(algorithm)) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`)
  }

  const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  const hash = createHash(algorithm)
  hash.update(inputBuffer)
  return hash.digest()
}