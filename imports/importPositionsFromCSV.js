import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import Position from '../models/Position.js';

dotenv.config({
  path: '../.env',
});

// Підключення до MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const importPositionsFromCSV = async () => {
  const positionsData = [];

  try {
    // Читання CSV файлу
    fs.createReadStream('../data/positions.csv')
      .pipe(
        csvParser({ separator: ';', mapHeaders: ({ header }) => header.trim() })
      ) // Очищення заголовків
      .on('data', (row) => {
        console.log('Row keys:', Object.keys(row));
        positionsData.push({
          code: row['Код посади']?.trim(),
          name: row['Назва посади']?.trim(),
          shortName:
            row['Скорочена назва']?.trim() || row['Назва посади']?.trim(),
        });
      })
      .on('end', async () => {
        console.log('Data ready for import:', positionsData);
        try {
          await Position.insertMany(positionsData);
          console.log('Positions data imported successfully from CSV!');
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

importPositionsFromCSV();
