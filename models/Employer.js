import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
  codeEDRPOU: {
    type: String,
    required: true,
    match: [/^\d{8}$|^\d{10}$/, 'Код ЄДРПОУ повинен містити 8 або 10 цифр'],
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
  },
});

const Employer = mongoose.model('Employer', employerSchema);

export default Employer;
