import express from 'express';
import { getAllPositions } from '../controllers/positionsController.js';

const router = express.Router();

router.get('/', getAllPositions);

export default router;
