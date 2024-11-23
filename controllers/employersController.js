import Employer from '../models/Employer.js';

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find()
      .select('name shortName codeEDRPOU')
      .sort({ name: 1 });
    res.json(employers);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch employers',
      error: error.message,
    });
  }
};
