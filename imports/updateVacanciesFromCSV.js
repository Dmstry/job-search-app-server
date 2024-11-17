import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import { parse } from 'date-fns';
import Vacancy from '../models/Vacancy.js';

dotenv.config({
  path: '../.env',
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error.message)
  );

const validateObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
  } catch (error) {
    return null;
  }
};

const sanitizeString = (str) => {
  return str?.trim() || null;
};

const updateVacanciesFromCSV = async () => {
  const batch = [];
  const batchSize = 100; // Process 100 records at a time

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream('../data/vacanciesUpdate.csv')
        .pipe(
          csvParser({
            separator: ';',
            mapHeaders: ({ header }) => header.trim(),
          })
        )
        .on('data', (row) => {
          try {
            // Validate required fields
            if (
              !row['Посада'] ||
              !row['Населений пункт'] ||
              !row['Роботодавець']
            ) {
              console.warn(
                `Skipping row due to missing required fields: ${JSON.stringify(
                  row
                )}`
              );
              return;
            }

            // Validate ObjectIds
            const titleId = validateObjectId(row['Посада']);
            const locationId = validateObjectId(row['Населений пункт']);
            const employerId = validateObjectId(row['Роботодавець']);

            if (!titleId || !locationId || !employerId) {
              console.warn(
                `Skipping row due to invalid ObjectIds: ${JSON.stringify(row)}`
              );
              return;
            }

            const rawDate = sanitizeString(row['Дата розміщення']);
            const parsedDate = parse(rawDate, 'dd.MM.yyyy', new Date());

            const update = {
              updateOne: {
                filter: {
                  vacancyNumber: sanitizeString(row['Номер вакансії']),
                },
                update: {
                  $set: {
                    title: titleId,
                    location: locationId,
                    employer: employerId,
                    employmentType: sanitizeString(row['Вид зайнятості']),
                    salary: row['Зарплата'] ? Number(row['Зарплата']) : null,
                    postedDate: isNaN(parsedDate) ? new Date() : parsedDate,
                    logo: sanitizeString(row['Логотип']),
                    responsibilities:
                      sanitizeString(row["Функціональні обов'язки"]) ||
                      'Не вказано',
                    schedule:
                      sanitizeString(row['Графік роботи']) || 'Не вказано',
                    educationRequirements: sanitizeString(row['Освіта']),
                    hasHigherEducation:
                      row['Наявність вищої освіти'] === 'TRUE',
                    educationDegree: sanitizeString(row['Ступінь освіти']),
                    hasExperience: row['Наявність досвіду'] === 'TRUE',
                    experience: sanitizeString(row['Кількість досвіду']),
                    contactDetails: {
                      phone: sanitizeString(row['Телефон']),
                      phoneHR: sanitizeString(row['Телефон HR']),
                      email: sanitizeString(row['Email']),
                    },
                    active: true,
                  },
                },
                upsert: true,
              },
            };

            batch.push(update);

            // Process batch if it reaches the specified size
            if (batch.length >= batchSize) {
              processBatch(batch);
              batch.length = 0;
            }
          } catch (err) {
            console.error(`Error processing row: ${JSON.stringify(row)}`, err);
          }
        })
        .on('end', async () => {
          // Process remaining records
          if (batch.length > 0) {
            await processBatch(batch);
          }
          resolve();
        })
        .on('error', reject);
    });

    console.log('CSV file processing completed.');
  } catch (error) {
    console.error('Error processing CSV file:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

async function processBatch(batch) {
  try {
    const result = await Vacancy.bulkWrite(batch, { ordered: false });
    console.log(
      `Processed ${result.modifiedCount + result.upsertedCount} records`
    );
  } catch (error) {
    console.error('Error processing batch:', error);
  }
}

updateVacanciesFromCSV();
