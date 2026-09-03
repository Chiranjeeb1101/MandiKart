/**
 * MandiKart Consent, Cookie Sessions, Permissions & Multi-Channel Notification Test Suite
 */

import { ConsentService, NotificationService, SessionManager } from '@mandikart/shared-core';
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

async function testConsentAndPermissions() {
  console.log('\n📜 1. Testing Terms, Privacy, Cookie Sessions & App Permissions:');

  const userId = 'farmer_ramesh_test_99';
  const role = UserRole.FARMER;

  // 1. Record explicit user consent
  const consent = await ConsentService.recordConsent({
    userId,
    role,
    input: {
      termsAndConditions: true,
      privacyPolicy: true,
      cookiesConsent: true,
      permissions: {
        location: true,
        camera: true,
        notifications: true,
        storage: true,
      },
      version: '1.0',
    },
    ipAddress: '192.168.1.50',
    userAgent: 'MandiKartMobile/1.0.0 (Android 14)',
  });

  assert(consent.termsAndConditions === true, 'Terms and Conditions accepted');
  assert(consent.privacyPolicy === true, 'Privacy Policy accepted');
  assert(consent.cookiesConsent === true, 'Cookie Session accepted');
  assert(consent.permissions.location === true, 'Location device permission granted');
  assert(consent.permissions.camera === true, 'Camera device permission granted');
  assert(consent.permissions.notifications === true, 'Notification device permission granted');

  // 2. Query status
  const fetched = ConsentService.getConsentStatus(userId, role);
  assert(fetched.userId === userId, 'Retrieved active consent record for user');
  assert(fetched.version === '1.0', 'Consent version correctly tracked');
}

async function testNotificationsAndPushPopups() {
  console.log('\n🔔 2. Testing In-App Inbox & Phone Push Popups:');

  const userId = 'farmer_ramesh_test_99';
  const role = UserRole.FARMER;

  // 1. Register mobile push token for the user's phone
  const deviceToken = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';
  const reg = NotificationService.registerDeviceToken({
    userId,
    role,
    token: deviceToken,
    deviceType: 'android',
  });

  assert(reg.token === deviceToken, 'Phone device push token successfully registered');
  assert(reg.deviceType === 'android', 'Device type tracked as android');

  // 2. Send multi-channel notification (In-App + Phone Push Pop)
  const notifResult = await NotificationService.sendNotification({
    userId,
    role,
    title: 'New Order Received! 🌾',
    body: 'Buyer Amit Grocery Mart ordered 500kg Red Onion.',
    type: 'ORDER_UPDATE',
    metadata: { orderId: 'ord_test_500', totalAmount: 13250 },
    sendPush: true,
  });

  assert(notifResult.inApp.title === 'New Order Received! 🌾', 'In-app notification created with correct title');
  assert(notifResult.inApp.isRead === false, 'New notification defaults to unread');
  assert(notifResult.pushSent === true, 'Phone push popup successfully dispatched');

  // Send a second notification
  await NotificationService.sendNotification({
    userId,
    role,
    title: 'Price Alert: Onion Up by 8% 📈',
    body: 'Lasalgaon Mandi modal rates increased to Rs 26.50/kg.',
    type: 'PRICE_ALERT',
    sendPush: true,
  });

  // 3. List In-App feed and check unread count
  const list = NotificationService.listNotifications({ userId });
  assert(list.total >= 2, `Notification feed has total items (actual: ${list.total})`);
  assert(list.unreadCount >= 2, `Unread badge count matches unread items (actual: ${list.unreadCount})`);

  // 4. Mark single as read
  const markSingle = NotificationService.markAsRead(notifResult.inApp.id, userId);
  assert(markSingle === true, 'Single notification marked as read');

  const listAfterSingle = NotificationService.listNotifications({ userId });
  assert(listAfterSingle.unreadCount === list.unreadCount - 1, 'Unread badge count decremented after single read');

  // 5. Mark all as read
  const markedAllCount = NotificationService.markAllAsRead(userId);
  assert(markedAllCount >= 1, `Mark all as read marked remaining items (actual: ${markedAllCount})`);

  const listAfterAll = NotificationService.listNotifications({ userId });
  assert(listAfterAll.unreadCount === 0, 'Unread badge count reaches 0 after mark-all-read');
}

async function testLiveRestEndpoints() {
  console.log('\n🌐 3. Testing Live REST Endpoints on Farmer Backend (Port 4000):');

  // 1. Authenticate to get 15-day session token from running server
  const loginRes = await fetch('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '9876543210', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 2. Consent agree endpoint
  const agreeRes = await fetch('http://localhost:4000/api/v1/consent/agree', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      termsAndConditions: true,
      privacyPolicy: true,
      cookiesConsent: true,
      permissions: {
        location: true,
        camera: true,
        notifications: true,
      },
    }),
  });
  assert(agreeRes.status === 200, `POST /consent/agree returns 200 (actual: ${agreeRes.status})`);
  const agreeBody = await agreeRes.json();
  assert(agreeBody.data?.termsAndConditions === true, 'Terms accepted via live REST endpoint');

  // 3. Consent status endpoint
  const statusRes = await fetch('http://localhost:4000/api/v1/consent/status', {
    method: 'GET',
    headers,
  });
  assert(statusRes.status === 200, `GET /consent/status returns 200 (actual: ${statusRes.status})`);
  const statusBody = await statusRes.json();
  assert(statusBody.data?.cookiesConsent === true, 'Cookie agreement verified via live status endpoint');

  // 4. Register push token endpoint
  const deviceTokenRes = await fetch('http://localhost:4000/api/v1/notifications/device-token', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      token: 'ExponentPushToken[demo_phone_token_12345]',
      deviceType: 'android',
    }),
  });
  assert(deviceTokenRes.status === 200, `POST /notifications/device-token returns 200 (actual: ${deviceTokenRes.status})`);

  // 5. Test push popup endpoint
  const pushRes = await fetch('http://localhost:4000/api/v1/notifications/test-push', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'Order Dispatched! 🚚',
      body: 'Your lot of 500kg Tomatoes is on its way to Mumbai.',
    }),
  });
  assert(pushRes.status === 201, `POST /notifications/test-push returns 201 (actual: ${pushRes.status})`);
  const pushBody = await pushRes.json();
  assert(pushBody.data?.pushSent === true, 'Phone push popup dispatched over live REST endpoint');

  // 6. List notifications endpoint
  const listRes = await fetch('http://localhost:4000/api/v1/notifications', {
    method: 'GET',
    headers,
  });
  assert(listRes.status === 200, `GET /notifications returns 200 (actual: ${listRes.status})`);
  const listBody = await listRes.json();
  assert(Array.isArray(listBody.data), 'Notifications list is returned as an array');
  assert(listBody.meta?.unreadCount >= 1, `Unread count badge > 0 (actual: ${listBody.meta?.unreadCount})`);

  // 7. Mark all read endpoint
  const readAllRes = await fetch('http://localhost:4000/api/v1/notifications/read-all', {
    method: 'PATCH',
    headers,
  });
  assert(readAllRes.status === 200, `PATCH /notifications/read-all returns 200 (actual: ${readAllRes.status})`);
}

async function main() {
  await testConsentAndPermissions();
  await testNotificationsAndPushPopups();
  await testLiveRestEndpoints();

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
