/**
 * MandiKart — Canonical Zod Schemas for Input Validation
 */

import { z } from 'zod';
import { OrderStatus, ProduceGrade, BuyerTarget, QuantityUnit } from '../enums/orderStatus.js';

// Auth Schemas
export const SignupSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  method: z.enum(['sms', 'whatsapp']).default('sms'),
});

export const LoginSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  password: z.string().min(1, 'Password is required'),
});

export const SendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  method: z.enum(['sms', 'whatsapp']).default('sms'),
});

export const VerifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

// Farmer Profile Schemas
export const UpdateFarmerProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits')
    .optional(),
  state: z.string().min(2).max(50).default('Maharashtra'),
  district: z.string().min(2).max(50).default('Nashik'),
  taluka: z.string().max(50).optional(),
  village: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export const UpdateFarmDetailsSchema = z.object({
  farmSizeAcres: z.number().positive('Farm size must be greater than 0'),
  ownershipType: z.enum(['Owner', 'Owned', 'Tenant', 'Leased', 'Sharecropper', 'Other']).default('Owner'),
  primaryCrops: z.array(z.string()).min(1, 'Select at least one crop'),
  irrigationType: z.string().optional(),
});

export const UpdatePreferencesSchema = z.object({
  preferredLanguage: z.enum(['en', 'hi', 'or', 'mr', 'pa', 'ta', 'te', 'bn', 'gu', 'kn']),
});

export const UpdateBankDetailsSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID format').optional(),
  bankAccountNumber: z.string().min(9).max(18, 'Account number must be between 9 and 18 digits'),
  bankIfsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format (e.g. SBIN0001234)'),
  bankAccountName: z.string().min(2).max(100),
});

// Product Listing Schemas
export const CreateProductSchema = z.object({
  cropName: z.string().min(2).max(100),
  cropVariety: z.string().max(100).optional(),
  grade: z.nativeEnum(ProduceGrade).default(ProduceGrade.A),
  category: z.string().min(2).max(50),
  totalQuantity: z.number().positive('Total quantity must be greater than 0'),
  quantityUnit: z.nativeEnum(QuantityUnit).default(QuantityUnit.KG),
  basePricePerUnit: z.number().positive('Price must be greater than 0'),
  minOrderQuantity: z.number().positive().default(1),
  targetBuyer: z.nativeEnum(BuyerTarget).default(BuyerTarget.BOTH),
  images: z.array(z.string()).default([]),
  pickupAddress: z.string().optional(),
  pickupLatitude: z.number().min(-90).max(90).optional(),
  pickupLongitude: z.number().min(-180).max(180).optional(),
  harvestDate: z.string().optional(),
  shelfLifeDays: z.number().int().positive().default(7),
});

export const UpdateProductStockSchema = z.object({
  availableQuantity: z.number().min(0, 'Available quantity cannot be negative'),
  isActive: z.boolean().optional(),
});

// Order Action Schemas
export const RejectOrderSchema = z.object({
  reason: z.string().min(3, 'Reason is required for rejection'),
});

export const VerifyPickupSchema = z.object({
  pickupOtp: z.string().length(6, 'Pickup OTP must be exactly 6 digits'),
});

export const NegotiateSchema = z.object({
  counterPricePerUnit: z.number().positive('Counter price must be positive'),
  remarks: z.string().max(250).optional(),
});

// Market Intelligence Query Schema
export const MarketRatesQuerySchema = z.object({
  district: z.string().optional(),
  commodity: z.string().optional(),
  state: z.string().optional(),
});

// Consent, Cookies & App Permissions Schema
export const ConsentInputSchema = z.object({
  termsAndConditions: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms and Conditions to proceed',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Policy to proceed',
  }),
  cookiesConsent: z.boolean().default(true),
  permissions: z
    .object({
      location: z.boolean().default(false),
      camera: z.boolean().default(false),
      notifications: z.boolean().default(false),
      storage: z.boolean().default(false),
    })
    .optional(),
  version: z.string().default('1.0'),
});

// Device Push Token Registration Schema
export const DeviceTokenSchema = z.object({
  token: z.string().min(10, 'Push token must be a valid Expo or FCM token'),
  deviceType: z.enum(['android', 'ios', 'web']).default('android'),
});

