/**
 * MandiKart — Cryptographic Utilities for Sensitive Data (Aadhaar & Bank Details)
 * Implements AES-256-GCM encryption at rest with safe last-4 extractors.
 */
export declare function encryptField(plainText: string): string;
export declare function decryptField(cipherText: string): string;
export declare function extractLast4(value: string): string;
