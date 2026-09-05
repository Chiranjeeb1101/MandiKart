"use strict";
/**
 * MandiKart — Canonical Zod Schemas for Input Validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenSchema = exports.ConsentInputSchema = exports.MarketRatesQuerySchema = exports.NegotiateSchema = exports.VerifyPickupSchema = exports.RejectOrderSchema = exports.UpdateProductStockSchema = exports.CreateProductSchema = exports.UpdateBankDetailsSchema = exports.UpdatePreferencesSchema = exports.UpdateFarmDetailsSchema = exports.UpdateFarmerProfileSchema = exports.VerifyOtpSchema = exports.SendOtpSchema = exports.LoginSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
const orderStatus_js_1 = require("../enums/orderStatus.js");
// Auth Schemas
exports.SignupSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number (e.g. 9876543210)'),
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters').max(100),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    method: zod_1.z.enum(['sms', 'whatsapp']).default('sms'),
});
exports.LoginSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.SendOtpSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
    method: zod_1.z.enum(['sms', 'whatsapp']).default('sms'),
});
exports.VerifyOtpSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
    otp: zod_1.z.string().length(6, 'OTP must be exactly 6 digits'),
});
// Farmer Profile Schemas
exports.UpdateFarmerProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(100).optional(),
    aadhaarNumber: zod_1.z
        .string()
        .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits')
        .optional(),
    state: zod_1.z.string().min(2).max(50),
    district: zod_1.z.string().min(2).max(50),
    taluka: zod_1.z.string().max(50).optional(),
    village: zod_1.z.string().max(50).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
});
exports.UpdateFarmDetailsSchema = zod_1.z.object({
    farmSizeAcres: zod_1.z.number().positive('Farm size must be greater than 0'),
    ownershipType: zod_1.z.enum(['Owner', 'Tenant', 'Sharecropper', 'Other']).default('Owner'),
    primaryCrops: zod_1.z.array(zod_1.z.string()).min(1, 'Select at least one crop'),
    irrigationType: zod_1.z.string().optional(),
});
exports.UpdatePreferencesSchema = zod_1.z.object({
    preferredLanguage: zod_1.z.enum(['en', 'hi', 'or', 'mr', 'pa', 'ta', 'te', 'bn', 'gu', 'kn']),
});
exports.UpdateBankDetailsSchema = zod_1.z.object({
    upiId: zod_1.z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID format').optional(),
    bankAccountNumber: zod_1.z.string().min(9).max(18, 'Account number must be between 9 and 18 digits'),
    bankIfsc: zod_1.z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format (e.g. SBIN0001234)'),
    bankAccountName: zod_1.z.string().min(2).max(100),
});
// Product Listing Schemas
exports.CreateProductSchema = zod_1.z.object({
    cropName: zod_1.z.string().min(2).max(100),
    cropVariety: zod_1.z.string().max(100).optional(),
    grade: zod_1.z.nativeEnum(orderStatus_js_1.ProduceGrade).default(orderStatus_js_1.ProduceGrade.A),
    category: zod_1.z.string().min(2).max(50),
    totalQuantity: zod_1.z.number().positive('Total quantity must be greater than 0'),
    quantityUnit: zod_1.z.nativeEnum(orderStatus_js_1.QuantityUnit).default(orderStatus_js_1.QuantityUnit.KG),
    basePricePerUnit: zod_1.z.number().positive('Price must be greater than 0'),
    minOrderQuantity: zod_1.z.number().positive().default(1),
    targetBuyer: zod_1.z.nativeEnum(orderStatus_js_1.BuyerTarget).default(orderStatus_js_1.BuyerTarget.BOTH),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    pickupAddress: zod_1.z.string().optional(),
    pickupLatitude: zod_1.z.number().min(-90).max(90).optional(),
    pickupLongitude: zod_1.z.number().min(-180).max(180).optional(),
    harvestDate: zod_1.z.string().optional(),
    shelfLifeDays: zod_1.z.number().int().positive().default(7),
});
exports.UpdateProductStockSchema = zod_1.z.object({
    availableQuantity: zod_1.z.number().min(0, 'Available quantity cannot be negative'),
    isActive: zod_1.z.boolean().optional(),
});
// Order Action Schemas
exports.RejectOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3, 'Reason is required for rejection'),
});
exports.VerifyPickupSchema = zod_1.z.object({
    pickupOtp: zod_1.z.string().length(6, 'Pickup OTP must be exactly 6 digits'),
});
exports.NegotiateSchema = zod_1.z.object({
    counterPricePerUnit: zod_1.z.number().positive('Counter price must be positive'),
    remarks: zod_1.z.string().max(250).optional(),
});
// Market Intelligence Query Schema
exports.MarketRatesQuerySchema = zod_1.z.object({
    district: zod_1.z.string().optional(),
    commodity: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
});
// Consent, Cookies & App Permissions Schema
exports.ConsentInputSchema = zod_1.z.object({
    termsAndConditions: zod_1.z.boolean().refine((val) => val === true, {
        message: 'You must accept the Terms and Conditions to proceed',
    }),
    privacyPolicy: zod_1.z.boolean().refine((val) => val === true, {
        message: 'You must accept the Privacy Policy to proceed',
    }),
    cookiesConsent: zod_1.z.boolean().default(true),
    permissions: zod_1.z
        .object({
        location: zod_1.z.boolean().default(false),
        camera: zod_1.z.boolean().default(false),
        notifications: zod_1.z.boolean().default(false),
        storage: zod_1.z.boolean().default(false),
    })
        .optional(),
    version: zod_1.z.string().default('1.0'),
});
// Device Push Token Registration Schema
exports.DeviceTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(10, 'Push token must be a valid Expo or FCM token'),
    deviceType: zod_1.z.enum(['android', 'ios', 'web']).default('android'),
});
