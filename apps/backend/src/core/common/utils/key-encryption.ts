import * as crypto from 'crypto';

const getKey = (envKey: string) => {
  const buffered = Buffer.from(envKey, 'base64');
  if (!buffered || buffered.length !== 32) {
    throw new Error('Invalid key. Must be of lenfth 32');
  }
  return buffered;
};

/**
 * Encrypt plaintext using AES-256-GCM.
 */
export const encrypt = (plaintext: string, key: string): string => {
  const bufferKey = getKey(key);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', bufferKey, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')]).toString(
    'hex',
  );
};

/**
 * Decrypt encrypted data using AES-256-GCM.
 */
export const decrypt = (encryptedData: string, key: string): string => {
  const bufferKey = getKey(key);
  const buffer = Buffer.from(encryptedData, 'hex');
  const iv = buffer.subarray(0, 12); // Extract IV
  const authTag = buffer.subarray(12, 28); // Extract auth tag
  const ciphertext = buffer.subarray(28); // Extract ciphertext

  const decipher = crypto.createDecipheriv('aes-256-gcm', bufferKey, iv);
  decipher.setAuthTag(authTag); // Set the authentication tag

  // Explicitly specify `Buffer` type for ciphertext input
  let decrypted = decipher.update(ciphertext, undefined, 'utf8');
  decrypted += decipher.final('utf8'); // Finalize decryption
  return decrypted;
};
