import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import Vacancy from '../models/Vacancy.js'; // Шлях до моделі вакансій
import Position from '../models/Position.js'; // Шлях до моделі посад
import Locality from '../models/Locality.js'; // Шлях до моделі населених пунктів
import Employer from '../models/Employer.js'; // Шлях до моделі роботодавців

dotenv.config({
  path: '../.env', // Завантаження змінних оточення
});

// Підключення до MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error.message)
  );

// Імпорт вакансій
const importVacanciesFromCSV = async () => {
  const vacanciesData = [];

  try {
    // Читання CSV файлу
    fs.createReadStream('../data/vacancies.csv')
      .pipe(
        csvParser({ separator: ';', mapHeaders: ({ header }) => header.trim() })
      )
      .on('data', async (row) => {
        try {
          // Пропускаємо рядки, де поле Посада, Населений пункт або Роботодавець є порожніми
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

          // Додаємо вакансію у масив для подальшого імпорту
          vacanciesData.push({
            title: new mongoose.Types.ObjectId(row['Посада']), // Перетворюємо в ObjectId
            location: new mongoose.Types.ObjectId(row['Населений пункт']), // Перетворюємо в ObjectId
            employer: new mongoose.Types.ObjectId(row['Роботодавець']), // Перетворюємо в ObjectId
            employmentType: row['Вид зайнятості']?.trim(),
            salary: row['Зарплата'] ? Number(row['Зарплата']) : null,
            postedDate: new Date(row['Дата розміщення']), // Використовуємо формат дати YYYY-MM-DD
            logo: row['Логотип']?.trim() || null,
            responsibilities:
              row["Функціональні обов'язки"]?.trim() || 'Не вказано', // Перевірка на порожнє значення
            schedule: row['Графік роботи']?.trim() || 'Не вказано', // Перевірка на порожнє значення
            educationRequirements: row['Освіта']?.trim(),
            hasHigherEducation: row['Наявність вищої освіти'] === 'Так',
            educationDegree: row['Ступінь освіти']?.trim() || null,
            hasExperience: row['Наявність досвіду'] === 'Так',
            experience: row['Кількість досвіду']?.trim() || null,
            contactDetails: {
              phone: row['Телефон'],
              phoneHR: row['Телефон HR'],
              email: row['Email'],
            },
            vacancyNumber: row['Номер вакансії']?.trim() || null,
            active: true, // За замовчуванням вакансія активна
          });

          console.log(`Row processed successfully: ${row['Посада']}`);
        } catch (err) {
          console.error(`Error processing row: ${JSON.stringify(row)}`, err);
        }
      })
      .on('end', async () => {
        console.log(`Total vacancies to import: ${vacanciesData.length}`);
        if (vacanciesData.length > 0) {
          try {
            await Vacancy.insertMany(vacanciesData);
            console.log('Vacancies data imported successfully from CSV!');
            process.exit();
          } catch (error) {
            console.error('Error importing data:', error);
            process.exit(1);
          }
        } else {
          console.log('No data to import.');
          process.exit();
        }
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    process.exit(1);
  }
};

importVacanciesFromCSV();
