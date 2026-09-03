/**
 * MandiKart Automated Test Suite
 * Validates Order State Machine, Inventory Reservation, and PII Encryption.
 */

import { OrderStatus, UserRole } from '@mandikart/shared-types';
import { canTransition, encryptField, decryptField, extractLast4 } from '@mandikart/shared-core';
import { InventoryService } from '../src/services/inventory.service.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🧪 Running MandiKart Backend Automated Tests...\n');

  // ── 1. Order State Machine Tests ──
  console.log('📦 1. Order State Machine Verification:');
  
  // Legal Farmer transitions
  assert(
    canTransition(OrderStatus.PLACED, OrderStatus.CONFIRMED, UserRole.FARMER).valid === true,
    'Farmer can accept PLACED order -> CONFIRMED'
  );

  assert(
    canTransition(OrderStatus.PLACED, OrderStatus.CANCELLED, UserRole.FARMER).valid === true,
    'Farmer can reject PLACED order -> CANCELLED'
  );

  assert(
    canTransition(OrderStatus.CONFIRMED, OrderStatus.PICKUP_SCHEDULED, UserRole.FARMER).valid === true,
    'Farmer can mark CONFIRMED order -> PICKUP_SCHEDULED'
  );

  assert(
    canTransition(OrderStatus.PICKUP_IN_PROGRESS, OrderStatus.COLLECTED, UserRole.FARMER).valid === true,
    'Farmer can verify pickup OTP -> COLLECTED'
  );

  // Illegal transitions
  assert(
    canTransition(OrderStatus.PLACED, OrderStatus.DELIVERED, UserRole.FARMER).valid === false,
    'Farmer cannot skip states directly from PLACED -> DELIVERED'
  );

  assert(
    canTransition(OrderStatus.COMPLETED, OrderStatus.PLACED, UserRole.FARMER).valid === false,
    'Cannot transition backwards from terminal COMPLETED state'
  );

  assert(
    canTransition(OrderStatus.CANCELLED, OrderStatus.CONFIRMED, UserRole.FARMER).valid === false,
    'Cannot resurrect CANCELLED order'
  );

  // Role authorization checks
  assert(
    canTransition(OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED, UserRole.BUYER).valid === false,
    'Buyer cannot mark order as DELIVERED (only Logistics Driver or Admin)'
  );

  assert(
    canTransition(OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED, UserRole.LOGISTICS_DRIVER).valid === true,
    'Logistics Driver can mark order as DELIVERED'
  );

  // ── 2. Sensitive PII Encryption Tests ──
  console.log('\n🔒 2. Sensitive Data Encryption & Masking:');

  const rawAadhaar = '987654321234';
  const encryptedAadhaar = encryptField(rawAadhaar);
  const decryptedAadhaar = decryptField(encryptedAadhaar);
  const aadhaarLast4 = extractLast4(rawAadhaar);

  assert(encryptedAadhaar !== rawAadhaar, 'Encrypted Aadhaar does not match plaintext');
  assert(encryptedAadhaar.includes(':'), 'Encrypted Aadhaar contains standard IV:Tag:Data format');
  assert(decryptedAadhaar === rawAadhaar, 'Decrypted Aadhaar matches original plaintext');
  assert(aadhaarLast4 === '1234', 'Aadhaar last4 extracted correctly');

  const rawBank = '012345678901234';
  const encryptedBank = encryptField(rawBank);
  const bankLast4 = extractLast4(rawBank);

  assert(encryptedBank !== rawBank, 'Encrypted bank account is not plaintext');
  assert(bankLast4 === '1234', 'Bank account last4 extracted correctly');

  // ── 3. Inventory Reservation Validation ──
  console.log('\n🌾 3. Inventory Reservation Logic:');

  const zeroReserve = await InventoryService.reserveStock('prod_1', 0);
  assert(zeroReserve.success === false, 'Reject reservation of 0 quantity');

  const negativeReserve = await InventoryService.reserveStock('prod_1', -50);
  assert(negativeReserve.success === false, 'Reject reservation of negative quantity');

  // Summary
  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
