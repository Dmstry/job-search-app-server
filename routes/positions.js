import express from 'express';
import Position from '../models/Position.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const positions = await Position.find().select('name shortName');
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
