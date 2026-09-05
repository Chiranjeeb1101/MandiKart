"use strict";
/**
 * MandiKart — Canonical Enums
 * Authoritative source across all 4 backends and shared libraries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeStatus = exports.QuantityUnit = exports.BuyerTarget = exports.ProduceGrade = exports.UserRole = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PLACED"] = "PLACED";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PICKUP_SCHEDULED"] = "PICKUP_SCHEDULED";
    OrderStatus["PICKUP_IN_PROGRESS"] = "PICKUP_IN_PROGRESS";
    OrderStatus["COLLECTED"] = "COLLECTED";
    OrderStatus["IN_TRANSIT"] = "IN_TRANSIT";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["DISPUTED"] = "DISPUTED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["FARMER"] = "FARMER";
    UserRole["BUYER"] = "BUYER";
    UserRole["LOGISTICS_DRIVER"] = "LOGISTICS_DRIVER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProduceGrade;
(function (ProduceGrade) {
    ProduceGrade["A"] = "A";
    ProduceGrade["B"] = "B";
    ProduceGrade["C"] = "C";
})(ProduceGrade || (exports.ProduceGrade = ProduceGrade = {}));
var BuyerTarget;
(function (BuyerTarget) {
    BuyerTarget["RETAIL"] = "RETAIL";
    BuyerTarget["BULK"] = "BULK";
    BuyerTarget["BOTH"] = "BOTH";
})(BuyerTarget || (exports.BuyerTarget = BuyerTarget = {}));
var QuantityUnit;
(function (QuantityUnit) {
    QuantityUnit["KG"] = "kg";
    QuantityUnit["QUINTAL"] = "quintal";
    QuantityUnit["CRATE"] = "crate";
    QuantityUnit["TONNE"] = "tonne";
})(QuantityUnit || (exports.QuantityUnit = QuantityUnit = {}));
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["OPEN"] = "OPEN";
    DisputeStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    DisputeStatus["RESOLVED_REFUND"] = "RESOLVED_REFUND";
    DisputeStatus["RESOLVED_SETTLED"] = "RESOLVED_SETTLED";
    DisputeStatus["REJECTED"] = "REJECTED";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
