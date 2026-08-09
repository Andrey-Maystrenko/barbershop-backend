const mongoose = require('mongoose');

const hairstyleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hairstyle name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Classic Cut',
      'Modern Cut',
      'Fade',
      'Beard',
      'Shave',
      'Coloring',
      'Styling',
      'Treatment',
      'Kids'
    ],
    default: 'Classic Cut'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [180, 'Duration cannot exceed 180 minutes'],
    comment: 'Duration in minutes'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'All'],
    default: 'All'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  // materials: [{
  //   materialId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Material'
  //   },
  //   quantity: {
  //     type: Number,
  //     min: 0,
  //     default: 1
  //   }
  // }],
  preparationTime: {
    type: Number,
    min: 0,
    default: 0,
    comment: 'Time needed for preparation in minutes'
  },
  aftercare: {
    type: String,
    maxlength: [500, 'Aftercare instructions cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Virtual for price with currency (can be used for formatting)
hairstyleSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for total time including preparation
hairstyleSchema.virtual('totalTime').get(function() {
  return this.duration + this.preparationTime;
});

// Indexes for better query performance
hairstyleSchema.index({ name: 1, category: 1 });
hairstyleSchema.index({ price: 1 });
hairstyleSchema.index({ popularity: -1 });

// Middleware: Update timestamps on save
// hairstyleSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// Static method to get popular hairstyles
hairstyleSchema.statics.getPopular = async function(limit = 5) {
  return this.find({ isActive: true })
    .sort({ popularity: -1 })
    .limit(limit);
};

// Instance method to check if service is available
hairstyleSchema.methods.isAvailable = function() {
  return this.isActive;
};

module.exports = mongoose.model('Hairstyle', hairstyleSchema);