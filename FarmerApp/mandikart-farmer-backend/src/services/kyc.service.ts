/**
 * MandiKart — FarmerApp KYC & Sensitive Data Service
 * Enforces AES-256 encryption at rest, last4 extraction, and presigned upload tokens.
 */

import { encryptField, extractLast4, getSupabaseAdmin } from '@mandikart/shared-core';

export class KycService {
  /**
   * Encrypts and securely updates farmer Aadhaar details without storing plaintext.
   */
  static async updateAadhaar(
    farmerId: string,
    rawAadhaar: string
  ): Promise<{ success: boolean; last4?: string; error?: string }> {
    const clean = rawAadhaar.replace(/\D/g, '');
    if (clean.length !== 12) {
      return { success: false, error: 'Aadhaar must be a 12-digit numeric identifier' };
    }

    const encrypted = encryptField(clean);
    const last4 = extractLast4(clean);

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
      return { success: true, last4 };
    }

    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from('farmers')
        .update({
          aadhaar_number_encrypted: encrypted,
          aadhaar_last4: last4,
          is_verified: true, // Marked verified upon ingestion in prototype flow
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmerId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, last4 };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Encrypts and updates bank details, storing only encrypted account number and last4.
   */
  static async updateBankDetails(
    farmerId: string,
    details: {
      upiId?: string;
      bankAccountNumber: string;
      bankIfsc: string;
      bankAccountName: string;
    }
  ): Promise<{ success: boolean; last4?: string; error?: string }> {
    const cleanAcc = details.bankAccountNumber.replace(/\s+/g, '');
    const encryptedAcc = encryptField(cleanAcc);
    const last4 = extractLast4(cleanAcc);

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
      return { success: true, last4 };
    }

    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from('farmers')
        .update({
          upi_id: details.upiId || null,
          bank_account_number_encrypted: encryptedAcc,
          bank_account_last4: last4,
          bank_ifsc: details.bankIfsc.toUpperCase(),
          bank_account_name: details.bankAccountName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmerId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, last4 };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Generates a secure presigned upload URL directly to Supabase Storage bucket
   * without routing bulky image binary bytes through the Node API process.
   */
  static async getPresignedUploadUrl(
    bucketName: string,
    fileName: string
  ): Promise<{ uploadUrl: string; publicUrl: string } | null> {
    try {
      const supabase = getSupabaseAdmin();
      const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUploadUrl(cleanFileName);

      if (error || !data) {
        return null;
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(cleanFileName);

      return {
        uploadUrl: data.signedUrl,
        publicUrl: publicData.publicUrl,
      };
    } catch {
      return null;
    }
  }
}
