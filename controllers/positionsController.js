import Position from '../models/Position.js';

export const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find().select('name shortName');
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
