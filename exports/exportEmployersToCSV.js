import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employer from '../models/Employer.js'; // Модель для колекції 'employers'

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

const exportEmployersToCSV = async () => {
  try {
    // Отримання всіх документів з колекції 'employers'
    const employers = await Employer.find();

    // Відкриття потоку для запису у CSV файл
    const writeStream = fs.createWriteStream('../data/employers_export.csv');

    // Запис заголовків до CSV
    writeStream.write('ObjectId;codeEDRPOU;Name;ShortName\n');

    // Запис кожного документа у CSV файл
    employers.forEach((employer) => {
      writeStream.write(
        `${employer._id};${employer.codeEDRPOU};${employer.name};${
          employer.shortName || employer.name
        }\n`
      );
    });

    console.log('Employers exported to CSV successfully!');
    writeStream.end();
  } catch (error) {
    console.error('Error exporting employers:', error);
  } finally {
    mongoose.connection.close();
  }
};

exportEmployersToCSV();
