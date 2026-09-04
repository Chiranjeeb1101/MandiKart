import { Request, Response } from 'express';
import { StripeService } from '../services/stripe.service.js';

export class PaymentsController {
  static async createIntent(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, amount, currency, buyerId, farmerId } = req.body;
      if (!orderId || !amount) {
        res.status(400).json({ error: 'orderId and amount are required.' });
        return;
      }

      const result = await StripeService.createPaymentIntent({
        orderId,
        amount: Number(amount),
        currency: currency || 'INR',
        buyerId,
        farmerId,
      });

      res.status(200).json({
        success: true,
        message: 'Stripe PaymentIntent generated successfully.',
        data: result,
      });
    } catch (err: any) {
      console.error('[PaymentsController] createIntent error:', err);
      res.status(500).json({ error: 'Failed to create payment intent', details: err?.message });
    }
  }

  static async confirm(req: Request, res: Response): Promise<void> {
    try {
      const { paymentIntentId, orderId } = req.body;
      if (!paymentIntentId || !orderId) {
        res.status(400).json({ error: 'paymentIntentId and orderId are required.' });
        return;
      }

      const result = await StripeService.confirmPayment(paymentIntentId, orderId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      console.error('[PaymentsController] confirm error:', err);
      res.status(500).json({ error: 'Failed to confirm payment', details: err?.message });
    }
  }

  static async webhook(req: Request, res: Response): Promise<void> {
    // Webhook listener for Stripe asynchronous events
    res.status(200).json({ received: true });
  }
}
