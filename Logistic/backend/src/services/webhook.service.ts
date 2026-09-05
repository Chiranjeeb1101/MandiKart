// ─── Webhook Targets ──────────────────────────────────────────────────────────
const FARMER_WEBHOOK_URL = () =>
  process.env.FARMER_WEBHOOK_URL || 'http://localhost:4000/api/webhooks/logistics';
const USER_WEBHOOK_URL = () =>
  process.env.USER_WEBHOOK_URL || 'http://localhost:4001/api/webhooks/logistics';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// ─── Retry Helper ─────────────────────────────────────────────────────────────
/**
 * POSTs payload to a URL with exponential backoff retries.
 * Delays: 1s → 2s → 4s  (BASE_DELAY_MS * 2^attempt)
 */
const postWithRetry = async (
  url: string,
  payload: Record<string, any>,
  attempt = 0
): Promise<void> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Version': '1' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000), // 5-second timeout per attempt
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from ${url}`);
    }

    console.log(`✅ [Webhook] ${payload.event} delivered to ${url}`);
  } catch (err) {
    if (attempt < MAX_RETRIES - 1) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(
        `⚠️  [Webhook] Attempt ${attempt + 1}/${MAX_RETRIES} failed for ${url}. Retrying in ${delay}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
      return postWithRetry(url, payload, attempt + 1);
    }
    console.error(`❌ [Webhook] All ${MAX_RETRIES} attempts failed for ${url}:`, (err as Error).message);
  }
};

// ─── Broadcast to all receivers ───────────────────────────────────────────────
const broadcast = (payload: Record<string, any>): void => {
  // Fire-and-forget — don't block the HTTP response
  void Promise.allSettled([
    postWithRetry(FARMER_WEBHOOK_URL(), payload),
    postWithRetry(USER_WEBHOOK_URL(), payload),
  ]).then(() => {
    console.log(`[Webhook] Broadcast complete for event: ${payload.event}`);
  });
};

// ─── WebhookService ───────────────────────────────────────────────────────────
export class WebhookService {
  /**
   * Fires when a driver completes a delivery (OTP verified).
   */
  static notifyDeliveryCompleted(orderId: string, driverId: string): void {
    broadcast({
      event: 'DELIVERY_COMPLETED',
      orderId,
      driverId,
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }

  /**
   * Fires when a driver starts heading to the farm for pickup.
   */
  static notifyPickupStarted(orderId: string, driverId: string): void {
    broadcast({
      event: 'PICKUP_STARTED',
      orderId,
      driverId,
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }

  /**
   * Fires when a driver reports any issue during a delivery.
   */
  static notifyIssueReported(
    orderId: string,
    driverId: string,
    issueType: string,
    description?: string
  ): void {
    broadcast({
      event: 'ISSUE_REPORTED',
      orderId,
      driverId,
      issueType,
      description: description || null,
      timestamp: new Date().toISOString(),
      version: 1,
    });
  }
}

