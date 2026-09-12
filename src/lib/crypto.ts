import crypto from 'crypto';

/**
 * 256-bit AES-GCM Cryptographic Architecture
 * Provides authenticated encryption at rest for sensitive application fields.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH_BYTES = 16; // 128-bit auth tag
const CURRENT_VERSION = 1;

export interface EncryptedPayload {
  version: number;
  iv: string; // hex
  tag: string; // hex
  data: string; // hex
}

/**
 * Derives or extracts a 32-byte (256-bit) buffer key from the environment.
 * If ENCRYPTION_KEY is not set or malformed, generates a deterministic development fallback.
 */
function getMasterKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (envKey) {
    // If it's a 64-char hex string, parse it directly:
    if (/^[0-9a-fA-F]{64}$/.test(envKey)) {
      return Buffer.from(envKey, 'hex');
    }
    // Otherwise derive a 32-byte key using SHA-256:
    return crypto.createHash('sha256').update(envKey).digest();
  }
  // Development safe fallback
  return crypto.createHash('sha256').update('naturestudios_default_dev_key_aes256_do_not_use_in_prod').digest();
}

/**
 * Encrypt a sensitive UTF-8 string with AES-256-GCM.
 */
export function encryptData(plaintext: string): EncryptedPayload {
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    version: CURRENT_VERSION,
    iv: iv.toString('hex'),
    tag: authTag.toString('hex'),
    data: encrypted,
  };
}

/**
 * Decrypt an AES-256-GCM payload.
 */
export function decryptData(payload: EncryptedPayload): string | null {
  try {
    const key = getMasterKey();
    const iv = Buffer.from(payload.iv, 'hex');
    const authTag = Buffer.from(payload.tag, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(payload.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('AES-256-GCM decryption failed:', error);
    return null;
  }
}

/**
 * Serialize an encrypted payload to a single string: "v1:iv:tag:data"
 */
export function serializeEncrypted(payload: EncryptedPayload): string {
  return `v${payload.version}:${payload.iv}:${payload.tag}:${payload.data}`;
}

/**
 * Deserialize a string back to an EncryptedPayload.
 */
export function deserializeEncrypted(serialized: string): EncryptedPayload | null {
  const parts = serialized.split(':');
  if (parts.length !== 4) return null;
  const version = parseInt(parts[0].replace(/^v/, ''), 10);
  return {
    version: isNaN(version) ? 1 : version,
    iv: parts[1],
    tag: parts[2],
    data: parts[3],
  };
}
