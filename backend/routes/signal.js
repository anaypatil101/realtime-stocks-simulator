import express from 'express';
import { getStockSignal } from '../controllers/signal.js';

const router = express.Router();

router.get('/:id/signal', getStockSignal);

export default router;
