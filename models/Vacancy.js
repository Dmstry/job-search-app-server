import mongoose from 'mongoose';

const vacancySchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.ObjectId, // Посилання на колекцію 'positions'
    ref: 'Position',
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId, // Посилання на колекцію 'localities'
    ref: 'Locality',
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId, // Посилання на колекцію 'employers'
    ref: 'Employer',
    required: true,
  },
  employmentType: {
    type: String,
    enum: [
      'Повна зайнятість',
      'Часткова зайнятість',
      'Сезонна робота',
      'Дистанційна робота',
    ],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  logo: {
    type: String, // URL логотипу роботодавця
    default: null,
  },
  responsibilities: {
    type: String, // Функціональні обов'язки
    required: true,
  },
  schedule: {
    type: String, // Графік роботи
    required: true,
  },
  educationRequirements: {
    type: String, // Вимоги до освіти
    required: true,
  },
  hasHigherEducation: {
    type: Boolean, // Наявність вищої освіти: Так/Ні
    required: true,
  },
  educationDegree: {
    type: String, // Ступінь освіти, якщо є вища освіта
    enum: ['Молодший спеціаліст', 'Бакалавр', 'Магістр'],
    default: null,
  },
  hasExperience: {
    type: Boolean, // Наявність досвіду: Так/Ні
    required: true,
  },
  experience: {
    type: String, // Кількість досвіду
    enum: ['півроку-рік', '2 роки', '3 роки', '3+'],
    default: null,
  },
  contactDetails: {
    phone: String, // Контактний телефон
    phoneHR: String, // Телефон HR
    email: String, // Контактний email
  },
  vacancyNumber: {
    type: String, // Номер вакансії для визначення робочої або користувацької вакансії
    default: null,
  },
  active: {
    type: Boolean,
    default: true, // Статус активності вакансії
  },
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);
export default Vacancy;
