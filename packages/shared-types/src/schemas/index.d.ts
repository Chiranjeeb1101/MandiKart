/**
 * MandiKart — Canonical Zod Schemas for Input Validation
 */
import { z } from 'zod';
import { ProduceGrade, BuyerTarget, QuantityUnit } from '../enums/orderStatus.js';
export declare const SignupSchema: z.ZodObject<{
    phone: z.ZodString;
    fullName: z.ZodString;
    password: z.ZodString;
    method: z.ZodDefault<z.ZodEnum<["sms", "whatsapp"]>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    fullName: string;
    password: string;
    method: "sms" | "whatsapp";
}, {
    phone: string;
    fullName: string;
    password: string;
    method?: "sms" | "whatsapp" | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    phone: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    password: string;
}, {
    phone: string;
    password: string;
}>;
export declare const SendOtpSchema: z.ZodObject<{
    phone: z.ZodString;
    method: z.ZodDefault<z.ZodEnum<["sms", "whatsapp"]>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    method: "sms" | "whatsapp";
}, {
    phone: string;
    method?: "sms" | "whatsapp" | undefined;
}>;
export declare const VerifyOtpSchema: z.ZodObject<{
    phone: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    otp: string;
}, {
    phone: string;
    otp: string;
}>;
export declare const UpdateFarmerProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    aadhaarNumber: z.ZodOptional<z.ZodString>;
    state: z.ZodString;
    district: z.ZodString;
    taluka: z.ZodOptional<z.ZodString>;
    village: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    state: string;
    district: string;
    fullName?: string | undefined;
    aadhaarNumber?: string | undefined;
    taluka?: string | undefined;
    village?: string | undefined;
    avatarUrl?: string | undefined;
}, {
    state: string;
    district: string;
    fullName?: string | undefined;
    aadhaarNumber?: string | undefined;
    taluka?: string | undefined;
    village?: string | undefined;
    avatarUrl?: string | undefined;
}>;
export declare const UpdateFarmDetailsSchema: z.ZodObject<{
    farmSizeAcres: z.ZodNumber;
    ownershipType: z.ZodDefault<z.ZodEnum<["Owner", "Tenant", "Sharecropper", "Other"]>>;
    primaryCrops: z.ZodArray<z.ZodString, "many">;
    irrigationType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    farmSizeAcres: number;
    ownershipType: "Owner" | "Tenant" | "Sharecropper" | "Other";
    primaryCrops: string[];
    irrigationType?: string | undefined;
}, {
    farmSizeAcres: number;
    primaryCrops: string[];
    ownershipType?: "Owner" | "Tenant" | "Sharecropper" | "Other" | undefined;
    irrigationType?: string | undefined;
}>;
export declare const UpdatePreferencesSchema: z.ZodObject<{
    preferredLanguage: z.ZodEnum<["en", "hi", "or", "mr", "pa", "ta", "te", "bn", "gu", "kn"]>;
}, "strip", z.ZodTypeAny, {
    preferredLanguage: "en" | "hi" | "or" | "mr" | "pa" | "ta" | "te" | "bn" | "gu" | "kn";
}, {
    preferredLanguage: "en" | "hi" | "or" | "mr" | "pa" | "ta" | "te" | "bn" | "gu" | "kn";
}>;
export declare const UpdateBankDetailsSchema: z.ZodObject<{
    upiId: z.ZodOptional<z.ZodString>;
    bankAccountNumber: z.ZodString;
    bankIfsc: z.ZodString;
    bankAccountName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bankAccountNumber: string;
    bankIfsc: string;
    bankAccountName: string;
    upiId?: string | undefined;
}, {
    bankAccountNumber: string;
    bankIfsc: string;
    bankAccountName: string;
    upiId?: string | undefined;
}>;
export declare const CreateProductSchema: z.ZodObject<{
    cropName: z.ZodString;
    cropVariety: z.ZodOptional<z.ZodString>;
    grade: z.ZodDefault<z.ZodNativeEnum<typeof ProduceGrade>>;
    category: z.ZodString;
    totalQuantity: z.ZodNumber;
    quantityUnit: z.ZodDefault<z.ZodNativeEnum<typeof QuantityUnit>>;
    basePricePerUnit: z.ZodNumber;
    minOrderQuantity: z.ZodDefault<z.ZodNumber>;
    targetBuyer: z.ZodDefault<z.ZodNativeEnum<typeof BuyerTarget>>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    pickupAddress: z.ZodOptional<z.ZodString>;
    pickupLatitude: z.ZodOptional<z.ZodNumber>;
    pickupLongitude: z.ZodOptional<z.ZodNumber>;
    harvestDate: z.ZodOptional<z.ZodString>;
    shelfLifeDays: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cropName: string;
    grade: ProduceGrade;
    category: string;
    totalQuantity: number;
    quantityUnit: QuantityUnit;
    basePricePerUnit: number;
    minOrderQuantity: number;
    targetBuyer: BuyerTarget;
    images: string[];
    shelfLifeDays: number;
    cropVariety?: string | undefined;
    pickupAddress?: string | undefined;
    pickupLatitude?: number | undefined;
    pickupLongitude?: number | undefined;
    harvestDate?: string | undefined;
}, {
    cropName: string;
    category: string;
    totalQuantity: number;
    basePricePerUnit: number;
    cropVariety?: string | undefined;
    grade?: ProduceGrade | undefined;
    quantityUnit?: QuantityUnit | undefined;
    minOrderQuantity?: number | undefined;
    targetBuyer?: BuyerTarget | undefined;
    images?: string[] | undefined;
    pickupAddress?: string | undefined;
    pickupLatitude?: number | undefined;
    pickupLongitude?: number | undefined;
    harvestDate?: string | undefined;
    shelfLifeDays?: number | undefined;
}>;
export declare const UpdateProductStockSchema: z.ZodObject<{
    availableQuantity: z.ZodNumber;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    availableQuantity: number;
    isActive?: boolean | undefined;
}, {
    availableQuantity: number;
    isActive?: boolean | undefined;
}>;
export declare const RejectOrderSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const VerifyPickupSchema: z.ZodObject<{
    pickupOtp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    pickupOtp: string;
}, {
    pickupOtp: string;
}>;
export declare const NegotiateSchema: z.ZodObject<{
    counterPricePerUnit: z.ZodNumber;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    counterPricePerUnit: number;
    remarks?: string | undefined;
}, {
    counterPricePerUnit: number;
    remarks?: string | undefined;
}>;
export declare const MarketRatesQuerySchema: z.ZodObject<{
    district: z.ZodOptional<z.ZodString>;
    commodity: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    state?: string | undefined;
    district?: string | undefined;
    commodity?: string | undefined;
}, {
    state?: string | undefined;
    district?: string | undefined;
    commodity?: string | undefined;
}>;
export declare const ConsentInputSchema: z.ZodObject<{
    termsAndConditions: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    privacyPolicy: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    cookiesConsent: z.ZodDefault<z.ZodBoolean>;
    permissions: z.ZodOptional<z.ZodObject<{
        location: z.ZodDefault<z.ZodBoolean>;
        camera: z.ZodDefault<z.ZodBoolean>;
        notifications: z.ZodDefault<z.ZodBoolean>;
        storage: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        storage: boolean;
        location: boolean;
        camera: boolean;
        notifications: boolean;
    }, {
        storage?: boolean | undefined;
        location?: boolean | undefined;
        camera?: boolean | undefined;
        notifications?: boolean | undefined;
    }>>;
    version: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    termsAndConditions: boolean;
    privacyPolicy: boolean;
    cookiesConsent: boolean;
    version: string;
    permissions?: {
        storage: boolean;
        location: boolean;
        camera: boolean;
        notifications: boolean;
    } | undefined;
}, {
    termsAndConditions: boolean;
    privacyPolicy: boolean;
    cookiesConsent?: boolean | undefined;
    permissions?: {
        storage?: boolean | undefined;
        location?: boolean | undefined;
        camera?: boolean | undefined;
        notifications?: boolean | undefined;
    } | undefined;
    version?: string | undefined;
}>;
export declare const DeviceTokenSchema: z.ZodObject<{
    token: z.ZodString;
    deviceType: z.ZodDefault<z.ZodEnum<["android", "ios", "web"]>>;
}, "strip", z.ZodTypeAny, {
    token: string;
    deviceType: "android" | "ios" | "web";
}, {
    token: string;
    deviceType?: "android" | "ios" | "web" | undefined;
}>;
