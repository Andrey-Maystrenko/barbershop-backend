const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // ===== PERSONAL INFORMATION =====
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
  
  // ===== CONTACT INFORMATION =====
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
  
  // ===== ADDRESS (Optional) =====
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // ===== PREFERENCES =====
  preferences: {
    preferredBarber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber'
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  
  // ===== STATISTICS (Auto-updated) =====
  stats: {
    totalVisits: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastVisit: {
      type: Date
    }
  },
  
  // ===== STATUS =====
  isActive: {
    type: Boolean,
    default: true
  },
  
  // ===== NOTES =====
  notes: {
    type: String,
    maxlength: 500
  }

}, {
  timestamps: true
});

// ===== INDEXES =====
clientSchema.index({ firstName: 1, lastName: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ phone: 1 });

// ===== VIRTUALS =====
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// ===== INSTANCE METHODS =====
clientSchema.methods.addVisit = async function(service) {
  this.stats.totalVisits += 1;
  this.stats.totalSpent += service.pricing.totalPrice || 0;
  this.stats.lastVisit = new Date();
  return this.save();
};

// ===== TO JSON CONFIGURATION =====
clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Client', clientSchema);