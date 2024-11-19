import express from 'express';
import Employer from '../models/Employer.js';

const router = express.Router();

// @route   GET /api/employers
// @desc    Get all employers
router.get('/', async (req, res) => {
  try {
    const employers = await Employer.find()
      .select('name shortName codeEDRPOU')
      .sort({ name: 1 }); // Sort alphabetically by name
    res.json(employers);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch employers',
      error: error.message,
    });
  }
});

export default router;
