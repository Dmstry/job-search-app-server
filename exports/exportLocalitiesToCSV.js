import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Locality from '../models/Locality.js'; // Модель для колекції 'localities'

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

const exportLocalitiesToCSV = async () => {
  try {
    // Отримання всіх документів з колекції 'localities'
    const localities = await Locality.find();

    // Відкриття потоку для запису у CSV файл
    const writeStream = fs.createWriteStream('../data/localities_export.csv');

    // Запис заголовків до CSV
    writeStream.write(
      'ObjectId;KATOTTG;Region;District;TerritorialCommunity;Locality;CityDistrict\n'
    );

    // Запис кожного документа у CSV файл
    localities.forEach((locality) => {
      writeStream.write(
        `${locality._id};${locality.katottgCode};${locality.region};${
          locality.district
        };${locality.territorialCommunity};${locality.locality};${
          locality.cityDistrict || ''
        }\n`
      );
    });

    console.log('Localities exported to CSV successfully!');
    writeStream.end();
  } catch (error) {
    console.error('Error exporting localities:', error);
  } finally {
    mongoose.connection.close();
  }
};

exportLocalitiesToCSV();
