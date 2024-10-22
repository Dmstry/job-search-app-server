// routes/vacancies.js
import express from 'express';
import Vacancy from '../models/Vacancy.js';

const router = express.Router();

// @route   GET /api/vacancies
// @desc    Get all vacancies
router.get('/', async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    res.status(200).json(vacancies);
  } catch (error) {
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
