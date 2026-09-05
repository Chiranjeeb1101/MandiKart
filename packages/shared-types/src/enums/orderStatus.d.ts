/**
 * MandiKart — Canonical Enums
 * Authoritative source across all 4 backends and shared libraries.
 */
export declare enum OrderStatus {
    PLACED = "PLACED",
    CONFIRMED = "CONFIRMED",
    PICKUP_SCHEDULED = "PICKUP_SCHEDULED",
    PICKUP_IN_PROGRESS = "PICKUP_IN_PROGRESS",
    COLLECTED = "COLLECTED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    DISPUTED = "DISPUTED"
}
export declare enum UserRole {
    FARMER = "FARMER",
    BUYER = "BUYER",
    LOGISTICS_DRIVER = "LOGISTICS_DRIVER",
    ADMIN = "ADMIN"
}
export declare enum ProduceGrade {
    A = "A",
    B = "B",
    C = "C"
}
export declare enum BuyerTarget {
    RETAIL = "RETAIL",
    BULK = "BULK",
    BOTH = "BOTH"
}
export declare enum QuantityUnit {
    KG = "kg",
    QUINTAL = "quintal",
    CRATE = "crate",
    TONNE = "tonne"
}
export declare enum DisputeStatus {
    OPEN = "OPEN",
    UNDER_REVIEW = "UNDER_REVIEW",
    RESOLVED_REFUND = "RESOLVED_REFUND",
    RESOLVED_SETTLED = "RESOLVED_SETTLED",
    REJECTED = "REJECTED"
}
