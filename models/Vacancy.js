import mongoose from 'mongoose';

const VacancySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: String,
  salary: String,
  employmentType: String,
  remoteFriendly: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Vacancy', VacancySchema);
