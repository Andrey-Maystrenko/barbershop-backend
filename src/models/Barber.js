const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  specialization: {
    type: [String],
    enum: ['Classic Cut', 'Fade', 'Beard Trim', 'Hot Towel Shave', 'Coloring', 'Kids Cut'],
    default: ['Classic Cut']
  },
  experience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  schedule: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

barberSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

barberSchema.set('toJSON', { virtuals: true });
barberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Barber', barberSchema);