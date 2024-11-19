import express from 'express';
import Locality from '../models/Locality.js';

const router = express.Router();

// @route   GET /api/localities
// @desc    Get all localities
router.get('/', async (req, res) => {
  try {
    const localities = await Locality.find()
      .select('locality region district territorialCommunity')
      .sort({ locality: 1 }); // Sort alphabetically by locality name

    // Transform the data to include a formatted display name
    const formattedLocalities = localities.map((loc) => ({
      _id: loc._id,
      name: loc.locality,
      fullName: `${loc.locality}, ${loc.district} район, ${loc.region} область`,
      region: loc.region,
      district: loc.district,
      territorialCommunity: loc.territorialCommunity,
    }));

    res.json(formattedLocalities);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch localities',
      error: error.message,
    });
  }
});

// @route   GET /api/localities/by-region/:region
// @desc    Get localities filtered by region
router.get('/by-region/:region', async (req, res) => {
  try {
    const localities = await Locality.find({
      region: new RegExp(req.params.region, 'i'),
    })
      .select('locality region district territorialCommunity')
      .sort({ locality: 1 });

    const formattedLocalities = localities.map((loc) => ({
      _id: loc._id,
      name: loc.locality,
      fullName: `${loc.locality}, ${loc.district} район, ${loc.region} область`,
      region: loc.region,
      district: loc.district,
      territorialCommunity: loc.territorialCommunity,
    }));

    res.json(formattedLocalities);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch localities by region',
      error: error.message,
    });
  }
});

export default router;
