import { Router, Request, Response } from 'express';
import { AnalyticsService } from '@mandikart/shared-core';

export const analyticsRouter = Router();

// GET /api/v1/analytics/dashboard - Fetch aggregated KPIs and chart data
analyticsRouter.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getDashboardAnalytics();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate analytics dashboard data',
      details: err?.message,
    });
  }
});

// POST /api/v1/analytics/event - Track client-side product view, search, cart event
analyticsRouter.post('/event', async (req: Request, res: Response) => {
  try {
    const { eventName, params } = req.body;
    if (!eventName) {
      return res.status(400).json({ success: false, error: 'eventName is required' });
    }

    AnalyticsService.logEvent(eventName, params || {});
    return res.status(200).json({ success: true, message: 'Event recorded' });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to record analytics event',
      details: err?.message,
    });
  }
});

export default analyticsRouter;
