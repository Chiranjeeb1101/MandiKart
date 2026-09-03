/**
 * MandiKart — Cryptographic Utilities for Sensitive Data (Aadhaar & Bank Details)
 * Implements AES-256-GCM encryption at rest with safe last-4 extractors.
 */

import crypto from 'crypto';
import { getValidatedEnv } from '@mandikart/shared-config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const env = getValidatedEnv();
  return crypto.scryptSync(env.PII_ENCRYPTION_KEY, 'mandikart-salt', 32);
}

export function encryptField(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Format: iv:tag:encryptedData (all hex encoded)
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptField(cipherText: string): string {
  if (!cipherText || !cipherText.includes(':')) return '';
  try {
    const [ivHex, tagHex, dataHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const data = Buffer.from(dataHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error('Decryption error:', err);
    return '';
  }
}

export function extractLast4(value: string): string {
  if (!value) return '';
  const clean = value.replace(/\D/g, '');
  return clean.length >= 4 ? clean.slice(-4) : clean;
}
