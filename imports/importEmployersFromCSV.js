import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import Employer from '../models/Employer.js'; // Не забудьте про .js

dotenv.config({
  path: '../.env',
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const importEmployersFromCSV = async () => {
  const employersData = [];

  try {
    fs.createReadStream('../data/employers.csv')
      .pipe(
        csvParser({ separator: ';', mapHeaders: ({ header }) => header.trim() })
      )
      .on('data', (row) => {
        employersData.push({
          codeEDRPOU: row['Код ЄДРПОУ']?.trim(),
          name: row['Назва роботодавця']?.trim(),
          shortName:
            row['Скорочена назва роботодавця']?.trim() ||
            row['Назва роботодавця']?.trim(),
        });
      })
      .on('end', async () => {
        for (const employer of employersData) {
          try {
            // Оновлюємо або додаємо роботодавця по коду ЄДРПОУ
            await Employer.updateOne(
              { codeEDRPOU: employer.codeEDRPOU },
              { $set: employer },
              { upsert: true }
            );
          } catch (error) {
            console.error('Error upserting data:', error);
          }
        }
        console.log('Employers data upserted successfully!');
        process.exit();
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    process.exit(1);
  }
};

importEmployersFromCSV();
