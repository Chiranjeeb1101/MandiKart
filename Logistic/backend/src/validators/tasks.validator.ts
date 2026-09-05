import { z } from 'zod';

// ─── Verify Pickup ────────────────────────────────────────────────────────────
export const verifyPickupSchema = z.object({
  pickupOtp: z
    .string({ required_error: 'Pickup OTP is required' })
    .min(4, 'OTP must be at least 4 characters')
    .max(8, 'OTP must be at most 8 characters')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

// ─── Complete Delivery ────────────────────────────────────────────────────────
export const completeDeliverySchema = z.object({
  deliveryOtp: z
    .string({ required_error: 'Delivery OTP is required' })
    .min(4, 'OTP must be at least 4 characters')
    .max(8, 'OTP must be at most 8 characters')
    .regex(/^\d+$/, 'OTP must contain only digits'),
  podImageUrl: z.string().url('POD image must be a valid URL').optional(),
  deliveredWeightKg: z.number().positive('Delivered weight must be positive').optional(),
});

// ─── Report Issue ─────────────────────────────────────────────────────────────
export const reportIssueSchema = z.object({
  issueType: z.enum(
    ['VEHICLE_BREAKDOWN', 'ACCIDENT', 'PRODUCE_DAMAGED', 'ROUTE_BLOCKED', 'WRONG_ADDRESS', 'OTHER'],
    { required_error: 'Issue type is required' }
  ),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  imageUrl: z.string().url('Image must be a valid URL').optional(),
});

// ─── TypeScript types inferred from schemas ───────────────────────────────────
export type VerifyPickupInput    = z.infer<typeof verifyPickupSchema>;
export type CompleteDeliveryInput = z.infer<typeof completeDeliverySchema>;
export type ReportIssueInput     = z.infer<typeof reportIssueSchema>;
