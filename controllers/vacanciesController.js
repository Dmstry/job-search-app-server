import Vacancy from '../models/Vacancy.js';
import mongoose from 'mongoose';

export const getAllVacancies = async (req, res) => {
  const { page = 1, limit = 18, sort = 'date_desc' } = req.query;
  const numericLimit = parseInt(limit, 10);

  try {
    const filter = buildFilter(req.query);
    const sortObj = buildSortObject(sort);

    const vacancies = await Vacancy.aggregate([
      ...buildLookupStages(),
      { $match: filter },
      { $sort: sortObj },
      { $skip: (page - 1) * numericLimit },
      { $limit: numericLimit },
      { $project: buildProjection() },
    ]);

    console.log('Aggregated Vacancies:', vacancies);
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createVacancy = async (req, res) => {
  try {
    const vacancyData = {
      ...req.body,
      educationDegree: req.body.hasHigherEducation
        ? req.body.educationDegree
        : null,
      experience: req.body.hasExperience ? req.body.experience : null,
    };

    const newVacancy = new Vacancy(vacancyData);
    const savedVacancy = await newVacancy.save();
    res.status(201).json(savedVacancy);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      details: error.errors,
    });
  }
};

export const getVacancyById = async (req, res) => {
  try {
    const vacancy = await Vacancy.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      ...buildLookupStages(),
    ]);

    if (!vacancy.length) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    res.json(vacancy[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Допоміжні функції
const buildFilter = (query) => {
  const filter = {};

  if (query.title) {
    filter['title'] = new mongoose.Types.ObjectId(query.title);
  }

  if (query.territorialCommunity) {
    filter['locationDetails.territorialCommunity'] = query.territorialCommunity;
  }

  if (query.hasHigherEducation === 'true') {
    filter['hasHigherEducation'] = true;
  } else if (query.hasHigherEducation === 'false') {
    filter['hasHigherEducation'] = false;
  }

  if (query.noExperienceRequired === 'true') {
    filter['hasExperience'] = false;
  }

  return filter;
};

const buildSortObject = (sort) => {
  switch (sort) {
    case 'salary_asc':
      return { salary: 1, postedDate: -1 };
    case 'salary_desc':
      return { salary: -1, postedDate: -1 };
    case 'date_asc':
      return { postedDate: 1 };
    default:
      return { postedDate: -1 };
  }
};

const buildLookupStages = () => [
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
];

const buildProjection = () => ({
  _id: 1,
  employmentType: 1,
  salary: 1,
  postedDate: 1,
  responsibilities: 1,
  'titleDetails.shortName': 1,
  'locationDetails.locality': 1,
  'locationDetails.territorialCommunity': 1,
  'employerDetails.shortName': 1,
});
