import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import vacanciesRoutes from './routes/vacancies.js';
import cors from 'cors';

// App Config
dotenv.config();
const app = express();
const port = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// DB Config
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// API Endpoints
app.use('/api/vacancies', vacanciesRoutes);

// Test Endpoint
app.get('/', (req, res) =>
  res.status(200).send('Hello from Job Search App Server')
);

// Listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
