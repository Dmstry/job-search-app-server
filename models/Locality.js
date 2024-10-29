import mongoose from 'mongoose';

const localitySchema = new mongoose.Schema({
  katottgCode: {
    type: String, // Код КАТОТТГ (унікальний ідентифікатор)
    required: true,
    unique: true,
    trim: true,
  },
  region: {
    type: String, // Область (наприклад, Запорізька)
    required: true,
    trim: true,
  },
  district: {
    type: String, // Район (наприклад, Запорізький)
    required: true,
    trim: true,
  },
  territorialCommunity: {
    type: String, // Територіальна громада (наприклад, Вільнянська міська ТГ)
    required: true,
    trim: true,
  },
  locality: {
    type: String, // Населений пункт (наприклад, Матвіївка)
    required: true,
    trim: true,
  },
  cityDistrict: {
    type: String, // Район у місті (опціонально, наприклад, Шевченківський)
    trim: true,
    default: null,
  },
});

const Locality = mongoose.model('Locality', localitySchema);

export default Locality;
