import Vacancy from '../models/Vacancy.js';

export const getAllVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVacancy = async (req, res) => {
  const newVacancy = new Vacancy(req.body);
  try {
    const savedVacancy = await newVacancy.save();
    res.status(201).json(savedVacancy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
