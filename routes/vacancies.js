// routes/vacancies.js
import express from 'express';
import Vacancy from '../models/Vacancy.js';

const router = express.Router();

// @route   GET /api/vacancies
// @desc    Get all vacancies
router.get('/', async (req, res) => {
  const { page = 1, limit = 18 } = req.query;
  const numericLimit = parseInt(limit, 10);

  try {
    const vacancies = await Vacancy.aggregate([
      {
        $lookup: {
          from: 'positions',
          localField: 'title',
          foreignField: '_id',
          as: 'titleDetails',
        },
      },
      {
        $lookup: {
          from: 'localities',
          localField: 'location',
          foreignField: '_id',
          as: 'locationDetails',
        },
      },
      {
        $lookup: {
          from: 'employers',
          localField: 'employer',
          foreignField: '_id',
          as: 'employerDetails',
        },
      },
      {
        $unwind: {
          path: '$titleDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$locationDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$employerDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          postedDate: -1, // Сортування за спаданням дати публікації
        },
      },
      {
        $skip: (page - 1) * numericLimit,
      },
      {
        $limit: numericLimit,
      },
      {
        $project: {
          _id: 1,
          employmentType: 1,
          salary: 1,
          postedDate: 1,
          responsibilities: 1,
          'titleDetails.shortName': 1,
          'locationDetails.locality': 1,
          'employerDetails.shortName': 1,
        },
      },
    ]);

    console.log('Aggregated Vacancies:', vacancies);
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/vacancies
// @desc    Create a new vacancy
router.post('/', async (req, res) => {
  const newVacancy = new Vacancy(req.body);
  try {
    const savedVacancy = await newVacancy.save();
    res.status(201).json(savedVacancy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
