import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Position from '../models/Position.js'; // Модель для колекції 'positions'

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

const exportPositionsToCSV = async () => {
  try {
    // Отримання всіх документів з колекції 'positions'
    const positions = await Position.find();

    // Відкриття потоку для запису у CSV файл
    const writeStream = fs.createWriteStream('../data/positions_export.csv');

    // Запис заголовків до CSV
    writeStream.write('ObjectId;Code;Name;ShortName\n');

    // Запис кожного документа у CSV файл
    positions.forEach((position) => {
      writeStream.write(
        `${position._id};${position.code};${position.name};${
          position.shortName || position.name
        }\n`
      );
    });

    console.log('Positions exported to CSV successfully!');
    writeStream.end();
  } catch (error) {
    console.error('Error exporting positions:', error);
  } finally {
    mongoose.connection.close();
  }
};

exportPositionsToCSV();
