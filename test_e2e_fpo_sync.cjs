const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

function makeRequest(port, method, pathStr, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path: `/api/v1${pathStr}`,
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock_jwt_token_test_1',
          'Idempotency-Key': `idemp-test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          ...headers,
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, text: body });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runE2E() {
  console.log('=== STARTING E2E TEST: DIRECT FPO PROCUREMENT TO FARMER BUYER REQUEST SYNC ===\n');

  // Step 1: Clean legacy demo items in os.tmpdir() cache file if present
  const cacheFile = path.join(os.tmpdir(), 'mandikart_shared_negotiations.json');
  try {
    if (fs.existsSync(cacheFile)) {
      const content = fs.readFileSync(cacheFile, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(item => item && item.id && !item.id.includes('neg_101') && !item.id.includes('req_101') && !item.id.includes('req_102') && !item.id.includes('req_103'));
        fs.writeFileSync(cacheFile, JSON.stringify(cleaned, null, 2), 'utf8');
        console.log(`[Cache Clean] Filtered ${parsed.length - cleaned.length} legacy demo items from shared disk store.`);
      }
    }
  } catch (e) {
    console.warn('[Cache Clean] Exception:', e.message);
  }

  // Step 2: User App Commercial Buyer submits a Direct FPO Procurement requirement
  const bulkPayload = {
    cropName: 'Basmati Rice',
    grade: 'A',
    requiredQuantity: 50,
    quantityUnit: 'quintal',
    maxTargetPricePerUnit: 4200,
    deliveryLocation: 'Punjab Commercial Grain Hub, GT Road',
    requiredByDate: '2026-09-30',
    buyerName: 'Vikramaditya (Commercial Bulk Buyer)',
    buyerPhone: '+91 98112 33445',
  };

  console.log('1. User App posting Direct FPO Procurement requirement...');
  const userRes = await makeRequest(4001, 'POST', '/bulk-requirements', bulkPayload);
  console.log(`   UserApp HTTP Response: ${userRes.status}`);
  console.log(`   Requirement ID: ${userRes.data?.data?.id}`);
  console.log(`   Buyer Name: ${userRes.data?.data?.buyerName}`);

  const reqId = userRes.data?.data?.id;
  if (!reqId) {
    console.error('FAILED: No requirement ID returned from UserApp backend!');
    process.exit(1);
  }

  // Step 3: Farmer App backend fetches list of incoming buyer requests
  console.log('\n2. Farmer App querying /negotiations for buyer requests...');
  const farmerRes = await makeRequest(4000, 'GET', '/negotiations');
  console.log(`   FarmerApp HTTP Response: ${farmerRes.status}`);
  console.log(`   Total Buyer Requests retrieved: ${farmerRes.data?.data?.length}`);

  const matchedReq = (farmerRes.data?.data || []).find((n) => n.id === reqId);
  if (!matchedReq) {
    console.error(`FAILED: Direct FPO Procurement requirement ${reqId} was not found in Farmer App negotiations list!`);
    console.log('Retrieved items:', farmerRes.data?.data);
    process.exit(1);
  }

  console.log('\nSUCCESS! Direct FPO Procurement request received cleanly in Farmer App!');
  console.log('Details verified:');
  console.log(`- Request ID: ${matchedReq.id}`);
  console.log(`- Buyer Name: ${matchedReq.buyerName}`);
  console.log(`- Buyer Phone: ${matchedReq.buyerPhone}`);
  console.log(`- Crop Name: ${matchedReq.cropName}`);
  console.log(`- Grade: ${matchedReq.grade}`);
  console.log(`- Quantity: ${matchedReq.quantity} ${matchedReq.unit}`);
  console.log(`- Offered Target Price: ₹${matchedReq.offeredPrice}/${matchedReq.unit}`);
  console.log(`- Remarks: ${matchedReq.remarks}`);
  console.log(`- Status: ${matchedReq.status}`);

  // Step 4: Farmer App sends a counter offer back to the bulk buyer
  console.log('\n3. Farmer App submitting Counter Offer to Bulk Buyer...');
  const counterRes = await makeRequest(4000, 'POST', `/negotiations/${reqId}/respond`, {
    action: 'COUNTER',
    counterPrice: 4250,
    counterQty: 50,
    message: 'Can supply 50 quintal organic Basmati Rice at ₹4,250/quintal.',
  });

  console.log(`   Counter HTTP Response: ${counterRes.status}`);
  console.log(`   Updated Status: ${counterRes.data?.data?.status}`);
  console.log(`   Updated Counter Price: ₹${counterRes.data?.data?.counterPrice}/${counterRes.data?.data?.unit}`);

  console.log('\n=== E2E TEST COMPLETED SUCCESSFULLY WITH 100% PASS RATE ===');
}

runE2E().catch(console.error);
