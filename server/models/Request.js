const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    petId: { type: String, required: true },
    petName: { type: String, required: true },
    petBreed: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    homeType: { type: String, required: true },
    kidsAtHome: { type: String, required: true },
    otherPets: { type: [String], required: true },
    visitDate: { type: Date, required: true },
    visitTime: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
