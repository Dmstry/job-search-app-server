import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vacancy from './models/Vacancy.js';
import vacancyData from './vacancy_seed_data.json' assert { type: 'json' };

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const seedVacancies = async () => {
  try {
    await Vacancy.insertMany(vacancyData);
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

seedVacancies();
