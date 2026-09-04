import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller.js';

const router = Router();

router.post('/create-intent', PaymentsController.createIntent);
router.post('/confirm', PaymentsController.confirm);
router.post('/webhook', PaymentsController.webhook);

export default router;
