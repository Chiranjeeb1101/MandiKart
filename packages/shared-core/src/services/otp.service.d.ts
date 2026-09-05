export type OtpChannel = 'SMS' | 'EMAIL' | 'WHATSAPP';
export interface OtpGenerationResult {
    identifier: string;
    channel: OtpChannel;
    expiresInSeconds: number;
    message: string;
    simulatedCode?: string;
}
export interface OtpVerificationResult {
    success: boolean;
    message: string;
    attemptsRemaining?: number;
}
export declare class OtpService {
    private static OTP_EXPIRY_MINUTES;
    private static MAX_ATTEMPTS;
    /**
     * Generates a 6-digit cryptographic OTP and registers it in the otps table.
     */
    static sendOtp(identifier: string, channel?: OtpChannel): Promise<OtpGenerationResult>;
    /**
     * Verifies an OTP against the hashed record.
     */
    static verifyOtp(identifier: string, code: string): Promise<OtpVerificationResult>;
}
