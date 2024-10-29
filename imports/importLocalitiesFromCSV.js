import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import Locality from '../models/Locality.js'; // Шлях до моделі Locality

dotenv.config({
  path: '../.env',
});

// Підключення до MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error.message)
  );

// Імпорт населених пунктів
const importLocalitiesFromCSV = async () => {
  const localitiesData = [];

  try {
    // Читання CSV файлу
    fs.createReadStream('../data/localities.csv')
      .pipe(
        csvParser({ separator: ';', mapHeaders: ({ header }) => header.trim() })
      )
      .on('data', (row) => {
        localitiesData.push({
          katottgCode: row['Код КАТОТТГ']?.trim(),
          region: row['Область']?.trim(),
          district: row['Район']?.trim(),
          territorialCommunity: row['Територіальна громада']?.trim(),
          locality: row['Населений пункт']?.trim(),
          cityDistrict: row['Район у місті']?.trim() || null,
        });
      })
      .on('end', async () => {
        try {
          await Locality.insertMany(localitiesData);
          console.log('Localities data imported successfully from CSV!');
          process.exit();
        } catch (error) {
          console.error('Error importing data:', error);
          process.exit(1);
        }
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    process.exit(1);
  }
};

importLocalitiesFromCSV();
