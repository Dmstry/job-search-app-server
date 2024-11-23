import express from 'express';
import { getAllEmployers } from '../controllers/employersController.js';

const router = express.Router();

router.get('/', getAllEmployers);

export default router;
