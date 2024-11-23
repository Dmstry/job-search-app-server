import Locality from '../models/Locality.js';

export const getAllLocalities = async (req, res) => {
  try {
    const localities = await Locality.find()
      .select('locality region district territorialCommunity')
      .sort({ locality: 1 });

    const formattedLocalities = formatLocalitiesResponse(localities);
    res.json(formattedLocalities);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch localities',
      error: error.message,
    });
  }
};

export const getLocalitiesByRegion = async (req, res) => {
  try {
    const localities = await Locality.find({
      region: new RegExp(req.params.region, 'i'),
    })
      .select('locality region district territorialCommunity')
      .sort({ locality: 1 });

    const formattedLocalities = formatLocalitiesResponse(localities);
    res.json(formattedLocalities);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch localities by region',
      error: error.message,
    });
  }
};

// Допоміжна функція для форматування відповіді
const formatLocalitiesResponse = (localities) => {
  return localities.map((loc) => ({
    _id: loc._id,
    name: loc.locality,
    fullName: `${loc.locality}, ${loc.district} район, ${loc.region} область`,
    region: loc.region,
    district: loc.district,
    territorialCommunity: loc.territorialCommunity,
  }));
};
