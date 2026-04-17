import { randomBytes } from 'crypto'
import { v1, v4 } from 'uuid'
import { UuidVersion, UUID_VERSIONS } from '../config'

export interface UuidResult {
  uuid: string
  version: UuidVersion
  variant: string
}

export function isValidUuidVersion(version: number): version is UuidVersion {
  return UUID_VERSIONS.includes(version as UuidVersion)
}

export function generateUuid(version: UuidVersion): UuidResult {
  if (!isValidUuidVersion(version)) {
    throw new Error(`Unsupported UUID version: ${version}`)
  }

  let uuid: string

  switch (version) {
    case 1:
      uuid = v1()
      break

    case 4:
      uuid = v4()
      break

    case 7:
      uuid = generateUuidV7()
      break

    default:
      throw new Error(`Unsupported UUID version: ${version}`)
  }

  return {
    uuid,
    version,
    variant: 'RFC 4122'
  }
}

/**
 * Generate UUID v7 (timestamp-based with random component)
 * UUID v7 is not yet in the uuid library, so we implement it manually
 * according to the draft specification.
 */
function generateUuidV7(): string {
  // Get current timestamp in milliseconds
  const timestamp = Date.now()

  // Convert timestamp to 48-bit big-endian byte array
  const timestampBytes = Buffer.allocUnsafe(6)
  timestampBytes.writeUIntBE(timestamp, 0, 6)

  // Generate 12 random bytes for the rest of the UUID
  const randomBytes1 = randomBytes(2)  // 12 bits + 4 version bits = 2 bytes
  const randomBytes2 = randomBytes(8)  // 62 random bits + 2 variant bits = 8 bytes

  // Set version (4 bits) to 7
  randomBytes1[0] = (randomBytes1[0] & 0x0f) | 0x70

  // Set variant (2 bits) to 10 (RFC 4122)
  randomBytes2[0] = (randomBytes2[0] & 0x3f) | 0x80

  // Combine all bytes
  const uuidBytes = Buffer.concat([timestampBytes, randomBytes1, randomBytes2])

  // Format as UUID string
  const hex = uuidBytes.toString('hex')
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32)
  ].join('-')
}

export function validateUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function getUuidVersion(uuid: string): number | null {
  if (!validateUuid(uuid)) {
    return null
  }

  // Version is stored in the first 4 bits of the 3rd group
  const versionChar = uuid.charAt(14)
  return parseInt(versionChar, 16)
}