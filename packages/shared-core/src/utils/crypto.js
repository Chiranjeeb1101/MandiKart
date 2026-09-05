"use strict";
/**
 * MandiKart — Cryptographic Utilities for Sensitive Data (Aadhaar & Bank Details)
 * Implements AES-256-GCM encryption at rest with safe last-4 extractors.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptField = encryptField;
exports.decryptField = decryptField;
exports.extractLast4 = extractLast4;
const crypto_1 = __importDefault(require("crypto"));
const shared_config_1 = require("@mandikart/shared-config");
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
function getKey() {
    const env = (0, shared_config_1.getValidatedEnv)();
    return crypto_1.default.scryptSync(env.PII_ENCRYPTION_KEY, 'mandikart-salt', 32);
}
function encryptField(plainText) {
    if (!plainText)
        return '';
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    // Format: iv:tag:encryptedData (all hex encoded)
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}
function decryptField(cipherText) {
    if (!cipherText || !cipherText.includes(':'))
        return '';
    try {
        const [ivHex, tagHex, dataHex] = cipherText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');
        const data = Buffer.from(dataHex, 'hex');
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, getKey(), iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        return decrypted.toString('utf8');
    }
    catch (err) {
        console.error('Decryption error:', err);
        return '';
    }
}
function extractLast4(value) {
    if (!value)
        return '';
    const clean = value.replace(/\D/g, '');
    return clean.length >= 4 ? clean.slice(-4) : clean;
}
