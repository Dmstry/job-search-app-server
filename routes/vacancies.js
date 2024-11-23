// routes/vacancies.js
import express from 'express';
import {
  getAllVacancies,
  createVacancy,
  getVacancyById,
} from '../controllers/vacanciesController.js';

const router = express.Router();

// @route   GET /api/vacancies
router.get('/', getAllVacancies);

// @route   POST /api/vacancies
router.post('/', createVacancy);

// @route   GET /api/vacancies/:id
router.get('/:id', getVacancyById);

export default router;
