import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String, // Може бути відсутня, тому не робимо її обов'язковою
  },
});

const Position = mongoose.model('Position', positionSchema);

export default Position;
