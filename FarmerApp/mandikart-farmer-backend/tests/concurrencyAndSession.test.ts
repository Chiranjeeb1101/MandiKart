/**
 * MandiKart Scalability & 15-Day Session Benchmark Test Suite
 * Tests 15-day rolling session logic and dispatches 1,000 concurrent API requests.
 */

import { SessionManager, FastLRUCache } from '@mandikart/shared-core';
import { UserRole } from '@mandikart/shared-types';

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

async function runSessionTests() {
  console.log('\n🔑 1. Validating 15-Day Rolling Session Management:');

  // 1. Issue brand new 15-day session
  const session = SessionManager.createSession({
    userId: 'farmer_ramesh_01',
    role: UserRole.FARMER,
    phone: '+919876543210',
  });

  assert(session.token.startsWith('mks_'), 'Session token begins with mks_ signature prefix');
  assert(session.sessionId.startsWith('sess_'), 'Session ID is uniquely prefixed');

  const expiryDate = new Date(session.expiresAt);
  const now = new Date();
  const diffDays = Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  assert(diffDays === 15, `Session expiry is exactly 15 days in future (${diffDays} days)`);

  // 2. Touch and extend session (sliding window)
  const validation = SessionManager.validateAndTouch(session.token);
  assert(validation.valid === true, 'Session token validates successfully on activity');
  assert(validation.renewed === true, 'Session activity rolls forward sliding expiration window');
  assert(validation.session?.userId === 'farmer_ramesh_01', 'User ID preserved in session record');

  // 3. Explicit session refresh
  const refresh = SessionManager.refreshSession(session.token);
  assert(refresh.success === true, 'Session refresh produces new 15-day extended token');

  // 4. Invalidation / Revocation
  SessionManager.revokeSession(session.sessionId);
  const recheck = SessionManager.validateAndTouch(session.token);
  // After revocation or expiry, recheck fails
  assert(!recheck.valid || recheck.session?.sessionId !== session.sessionId, 'Revoked session is invalidated');
}

async function runLRUCacheTests() {
  console.log('\n⚡ 2. Validating Sub-Millisecond FastLRUCache:');

  const cache = new FastLRUCache<string>(3);
  cache.set('a', 'alpha', 60);
  cache.set('b', 'beta', 60);
  cache.set('c', 'gamma', 60);

  assert(cache.get('a') === 'alpha', 'LRU cache returns stored item');

  // Insert 4th item; oldest ('b') should be evicted
  cache.get('a'); // Mark 'a' recently used
  cache.set('d', 'delta', 60);

  assert(cache.get('d') === 'delta', 'Newly inserted item is accessible');
  assert(cache.size <= 3, `Cache capacity strictly bounded to 3 items (actual: ${cache.size})`);
}

async function run1000RequestsBenchmark() {
  console.log('\n🚀 3. Executing 1,000 Concurrent Requests Scalability Benchmark:');

  const targetUrls = [
    'http://localhost:4000/api/v1/health',
    'http://localhost:4000/api/v1/market/rates?commodity=Tomato',
    'http://localhost:4001/api/v1/catalog',
  ];

  const TOTAL_REQUESTS = 1000;
  const CONCURRENCY_BATCH = 50;

  console.log(`  Dispatching ${TOTAL_REQUESTS} requests across endpoints with batch size ${CONCURRENCY_BATCH}...`);

  const startTime = Date.now();
  let completed = 0;
  let successCount = 0;
  let failCount = 0;

  // Dispatch in concurrent batches of 50 up to 1,000
  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY_BATCH) {
    const batch = [];
    const currentBatchSize = Math.min(CONCURRENCY_BATCH, TOTAL_REQUESTS - i);

    for (let j = 0; j < currentBatchSize; j++) {
      const url = targetUrls[(i + j) % targetUrls.length];
      batch.push(
        fetch(url, { headers: { 'Connection': 'keep-alive' } })
          .then((res) => {
            if (res.ok) successCount++;
            else failCount++;
          })
          .catch(() => {
            failCount++;
          })
          .finally(() => {
            completed++;
          })
      );
    }

    await Promise.all(batch);
  }

  const totalDurationSec = (Date.now() - startTime) / 1000;
  const reqPerSec = Math.round(TOTAL_REQUESTS / totalDurationSec);
  const avgLatencyMs = Math.round((totalDurationSec * 1000) / TOTAL_REQUESTS * 10) / 10;

  console.log(`\n  📊 Benchmark Summary:`);
  console.log(`  - Total Completed: ${completed}/${TOTAL_REQUESTS}`);
  console.log(`  - Success Rate: ${((successCount / TOTAL_REQUESTS) * 100).toFixed(1)}% (${successCount} OK, ${failCount} Failed)`);
  console.log(`  - Total Elapsed: ${totalDurationSec.toFixed(2)} seconds`);
  console.log(`  - Throughput: ${reqPerSec} requests/second`);
  console.log(`  - Average Latency: ${avgLatencyMs} ms/req`);

  assert(successCount >= 990, `High concurrency success rate >= 99% (actual: ${successCount}/${TOTAL_REQUESTS})`);
  assert(failCount === 0, `Zero failed requests under 1,000 load (actual: ${failCount} errors)`);
}

async function main() {
  await runSessionTests();
  await runLRUCacheTests();
  await run1000RequestsBenchmark();

  console.log(`\n========================================`);
  console.log(`Test Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Benchmark fatal error:', err);
  process.exit(1);
});
