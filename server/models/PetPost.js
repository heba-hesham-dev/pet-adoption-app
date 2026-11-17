const mongoose = require('mongoose');

const petPostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, required: true },
    size: { type: String, required: true },
    health: { type: [String], default: [] },
    goodWith: { type: [String], default: [] },
    about: { type: String, required: true },
    location: { type: String, required: true },
    adoptionFee: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    photos: {
      type: [String],
      validate: {
        validator: (photos) => photos.length >= 1 && photos.length <= 5,
        message: 'Please add between 1 and 5 photos',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PetPost', petPostSchema);
