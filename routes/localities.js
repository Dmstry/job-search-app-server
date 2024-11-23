import express from 'express';
import {
  getAllLocalities,
  getLocalitiesByRegion,
} from '../controllers/localitiesController.js';

const router = express.Router();

router.get('/', getAllLocalities);
router.get('/by-region/:region', getLocalitiesByRegion);

export default router;
