import { EncodingType, ENCODING_TYPES } from '../config'

export interface EncodingResult {
  encoded: string
  encoding: EncodingType
  input_length: number
}

export interface DecodingResult {
  decoded: string
  encoding: EncodingType
  output_length: number
}

export function isValidEncodingType(encoding: string): encoding is EncodingType {
  return ENCODING_TYPES.includes(encoding as EncodingType)
}

export function encodeData(data: string | Buffer, encoding: EncodingType): EncodingResult {
  if (!isValidEncodingType(encoding)) {
    throw new Error(`Unsupported encoding type: ${encoding}`)
  }

  // Convert input to buffer for consistent handling
  const inputBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')

  let encoded: string

  switch (encoding) {
    case 'base64':
      encoded = inputBuffer.toString('base64')
      break

    case 'base64url':
      // Base64URL uses - and _ instead of + and /, and removes padding
      encoded = inputBuffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
      break

    case 'hex':
      encoded = inputBuffer.toString('hex')
      break

    default:
      throw new Error(`Unsupported encoding type: ${encoding}`)
  }

  return {
    encoded,
    encoding,
    input_length: inputBuffer.length
  }
}

export function decodeData(data: string, encoding: EncodingType): DecodingResult {
  if (!isValidEncodingType(encoding)) {
    throw new Error(`Unsupported encoding type: ${encoding}`)
  }

  let decoded: Buffer

  try {
    switch (encoding) {
      case 'base64':
        decoded = Buffer.from(data, 'base64')
        break

      case 'base64url':
        // Convert Base64URL back to Base64 by replacing characters and adding padding
        let base64Data = data
          .replace(/-/g, '+')
          .replace(/_/g, '/')

        // Add padding if necessary
        const padding = 4 - (base64Data.length % 4)
        if (padding !== 4) {
          base64Data += '='.repeat(padding)
        }

        decoded = Buffer.from(base64Data, 'base64')
        break

      case 'hex':
        // Validate hex string
        if (!/^[0-9a-fA-F]*$/.test(data)) {
          throw new Error('Invalid hex string')
        }
        if (data.length % 2 !== 0) {
          throw new Error('Hex string must have even length')
        }
        decoded = Buffer.from(data, 'hex')
        break

      default:
        throw new Error(`Unsupported encoding type: ${encoding}`)
    }

    return {
      decoded: decoded.toString('utf8'),
      encoding,
      output_length: decoded.length
    }

  } catch (error) {
    throw new Error(`Failed to decode ${encoding} data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function isValidEncodedData(data: string, encoding: EncodingType): boolean {
  try {
    decodeData(data, encoding)
    return true
  } catch {
    return false
  }
}