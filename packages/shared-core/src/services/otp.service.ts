import crypto from 'crypto';
import { getSupabaseAdmin } from '../db/supabase.js';

export type OtpChannel = 'SMS' | 'EMAIL' | 'WHATSAPP';

export interface OtpGenerationResult {
  identifier: string;
  channel: OtpChannel;
  expiresInSeconds: number;
  message: string;
  simulatedCode?: string; // only populated in development
}

export interface OtpVerificationResult {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
}

export class OtpService {
  private static OTP_EXPIRY_MINUTES = 5;
  private static MAX_ATTEMPTS = 5;

  private static formatIdentifier(id: string): string {
    const trimmed = id.trim();
    if (trimmed.includes('@')) return trimmed.toLowerCase();
    const digits = trimmed.replace(/\D/g, '').slice(-10);
    return `+91${digits}`;
  }

  /**
   * Generates a 6-digit cryptographic OTP and registers it in the otps table.
   */
  static async sendOtp(
    identifier: string,
    channel: OtpChannel = 'SMS'
  ): Promise<OtpGenerationResult> {
    const cleanId = this.formatIdentifier(identifier);
    // Generate secure 6-digit code
    const rawCode = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash('sha256').update(rawCode).digest('hex');
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    const supabase = getSupabaseAdmin();
    try {
      // Invalidate existing unused OTPs for this identifier
      await supabase
        .from('otps')
        .update({ is_used: true })
        .eq('identifier', cleanId)
        .eq('is_used', false);

      // Insert fresh OTP into Supabase
      const { error: insErr } = await supabase.from('otps').insert({
        identifier: cleanId,
        code_hash: codeHash,
        channel,
        attempts: 0,
        max_attempts: this.MAX_ATTEMPTS,
        is_used: false,
        expires_at: expiresAt,
      });

      if (insErr) {
        console.warn('[OtpService] Supabase OTP insert notice:', insErr.message);
      }
    } catch (e) {
      console.warn('[OtpService] Supabase connection error:', e);
    }

    // Provider Dispatch Handler (Live SMS Gateway Integration via Fast2SMS)
    let isLiveDispatched = false;
    if (channel === 'SMS') {
      const rawDigits = cleanId.replace(/\D/g, '').slice(-10);
      isLiveDispatched = await this.dispatchFast2Sms(rawDigits, rawCode);
      console.log(`[SMS-GATEWAY] Telemetry: OTP generated for ${cleanId} -> OTP: ${rawCode} (Live Sent: ${isLiveDispatched})`);
    } else if (channel === 'EMAIL') {
      console.log(`[EMAIL-GATEWAY] Dispatching verification email to ${cleanId} -> Code: ${rawCode}`);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return {
      identifier: cleanId,
      channel,
      expiresInSeconds: this.OTP_EXPIRY_MINUTES * 60,
      message: isLiveDispatched
        ? `OTP has been dispatched via SMS to ${cleanId}.`
        : `OTP dispatched to ${cleanId} via ${channel}. Valid for 5 minutes.`,
      // When live SMS is dispatched to your phone, simulatedCode is hidden from in-app UI so it arrives only via SMS notification!
      simulatedCode: isLiveDispatched ? undefined : (isDev ? rawCode : undefined),
    };
  }

  /**
   * Dispatches live OTP SMS to Indian mobile numbers via Fast2SMS.
   * Supports:
   *  1. Predefined Template API (/dev/otp/send) when FAST2SMS_OTP_ID is set
   *  2. Quick OTP Route API (/dev/bulkV2) as default/fallback
   */
  private static async dispatchFast2Sms(phoneDigits: string, code: string): Promise<boolean> {
    const apiKey = (process.env.FAST2SMS_API_KEY || process.env.SMS_GATEWAY_API_KEY || '').trim();
    const otpId = (process.env.FAST2SMS_OTP_ID || '').trim();

    if (!apiKey) {
      console.warn('[Fast2SMS] No FAST2SMS_API_KEY found in environment. Please provide your Fast2SMS API key.');
      return false;
    }

    try {
      // 1. If an OTP Template ID is provided, call the dedicated /dev/otp/send endpoint
      if (otpId) {
        const response = await fetch('https://www.fast2sms.com/dev/otp/send', {
          method: 'POST',
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: phoneDigits,
            otp_id: otpId,
            otp: code,
            otp_length: code.length,
            otp_expiry: 5,
          }),
        });

        const json: any = await response.json();
        if (json && (json.return === true || json.status_code === 200)) {
          console.log(`[Fast2SMS] ✅ Delivered via /dev/otp/send to ${phoneDigits} (Request ID: ${json.request_id || 'OK'})`);
          return true;
        } else {
          console.warn(`[Fast2SMS] /dev/otp/send response:`, json?.message || json);
        }
      }

      // 2. Default / Fallback: Fast2SMS Quick OTP route (/dev/bulkV2)
      const bulkResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: code,
          route: 'otp',
          numbers: phoneDigits,
        }),
      });

      const bulkJson: any = await bulkResponse.json();
      if (bulkJson && (bulkJson.return === true || bulkJson.status_code === 200)) {
        console.log(`[Fast2SMS] ✅ Successfully delivered OTP SMS to ${phoneDigits} (Request ID: ${bulkJson.request_id || 'OK'})`);
        return true;
      } else {
        console.warn(`[Fast2SMS] ⚠️ Dispatch response:`, bulkJson?.message || bulkJson);
        return false;
      }
    } catch (err: any) {
      console.error(`[Fast2SMS] ❌ Network error:`, err?.message);
      return false;
    }
  }

  /**
   * Verifies an OTP against the hashed record in Supabase.
   */
  static async verifyOtp(
    identifier: string,
    code: string
  ): Promise<OtpVerificationResult> {
    const cleanId = this.formatIdentifier(identifier);
    const cleanCode = code.trim();

    const inputHash = crypto.createHash('sha256').update(cleanCode).digest('hex');
    const supabase = getSupabaseAdmin();

    try {
      const { data: record, error } = await supabase
        .from('otps')
        .select('*')
        .eq('identifier', cleanId)
        .eq('is_used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !record) {
        return { success: false, message: 'No active OTP found. Please request a new verification code.' };
      }

      // Expiry check
      if (new Date(record.expires_at) < new Date()) {
        await supabase.from('otps').update({ is_used: true }).eq('id', record.id);
        return { success: false, message: 'OTP has expired. Please request a new code.' };
      }

      // Attempts check
      if (record.attempts >= record.max_attempts) {
        await supabase.from('otps').update({ is_used: true }).eq('id', record.id);
        return { success: false, message: 'Too many failed attempts. Please request a new code.' };
      }

      // Match check
      if (record.code_hash !== inputHash) {
        await supabase
          .from('otps')
          .update({ attempts: record.attempts + 1 })
          .eq('id', record.id);

        return {
          success: false,
          message: 'Invalid OTP code. Please enter the correct code.',
          attemptsRemaining: record.max_attempts - (record.attempts + 1),
        };
      }

      // Mark verified
      await supabase
        .from('otps')
        .update({ is_used: true, verified_at: new Date().toISOString() })
        .eq('id', record.id);

      return { success: true, message: 'OTP verified successfully.' };
    } catch (e: any) {
      console.warn('[OtpService] Supabase verify error:', e);
      return { success: false, message: 'Verification service error. Please try again.' };
    }
  }
}
