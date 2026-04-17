import { randomBytes } from 'crypto'
import { Charset, CHARSETS } from '../config'

export interface RandomBytesResult {
  bytes: string
  length: number
  encoding: 'hex' | 'base64'
}

export interface RandomStringResult {
  string: string
  length: number
  charset: Charset
}

export function isValidCharset(charset: string): charset is Charset {
  return CHARSETS.includes(charset as Charset)
}

export function generateRandomBytes(length: number, encoding: 'hex' | 'base64' = 'hex'): RandomBytesResult {
  if (length <= 0 || length > 1024) {
    throw new Error('Byte length must be between 1 and 1024')
  }

  if (!Number.isInteger(length)) {
    throw new Error('Byte length must be an integer')
  }

  const bytes = randomBytes(length)
  const encoded = encoding === 'base64' ? bytes.toString('base64') : bytes.toString('hex')

  return {
    bytes: encoded,
    length,
    encoding
  }
}

export function generateRandomString(length: number, charset: Charset): RandomStringResult {
  if (length <= 0 || length > 1024) {
    throw new Error('String length must be between 1 and 1024')
  }

  if (!Number.isInteger(length)) {
    throw new Error('String length must be an integer')
  }

  if (!isValidCharset(charset)) {
    throw new Error(`Unsupported charset: ${charset}`)
  }

  const characterSets: Record<Charset, string> = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alphabetic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789abcdef',
    base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  }

  const chars = characterSets[charset]
  const charsLength = chars.length

  // Generate enough random bytes to ensure uniform distribution
  const bytesNeeded = Math.ceil(length * 1.5)  // Generate extra bytes for uniform selection
  const randomBytesArray = randomBytes(bytesNeeded)

  let result = ''
  let bytesUsed = 0

  for (let i = 0; i < length && bytesUsed < randomBytesArray.length; i++) {
    // Use rejection sampling to ensure uniform distribution
    const randomByte = randomBytesArray[bytesUsed++]

    // Calculate the maximum usable value to avoid bias
    const maxUsableValue = Math.floor(256 / charsLength) * charsLength - 1

    if (randomByte <= maxUsableValue) {
      result += chars[randomByte % charsLength]
    } else {
      // Reject this byte and try the next one
      i-- // Don't increment the result counter
    }
  }

  // If we didn't get enough characters (very unlikely), fill with additional random bytes
  while (result.length < length) {
    const extraByte = randomBytes(1)[0]
    const maxUsableValue = Math.floor(256 / charsLength) * charsLength - 1

    if (extraByte <= maxUsableValue) {
      result += chars[extraByte % charsLength]
    }
  }

  return {
    string: result,
    length: result.length,
    charset
  }
}

export function generateSecureToken(length: number = 32): string {
  return generateRandomBytes(length, 'hex').bytes
}

export function generateApiKey(prefix: string = 'sk', length: number = 24): string {
  const randomPart = generateRandomString(length, 'alphanumeric').string
  return `${prefix}_${randomPart}`
}