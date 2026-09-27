const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // ===== SERVICE NUMBER =====
  serviceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  
  // ===== STATUS =====
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  
  // ===== CLIENT INFORMATION =====
  client: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client ID is required']
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  
  // ===== BARBER INFORMATION =====
  barber: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
      required: [true, 'Barber ID is required']
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialization: {
      type: [String],
      default: []
    }
  },
  
  // ===== HAIRSTYLE INFORMATION =====
  hairstyle: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hairstyle',
      required: [true, 'Hairstyle ID is required']
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    duration: {
      type: Number,
      required: true,
      min: 5
    }
  },
  
  // ===== PRICING =====
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    discountReason: {
      type: String,
      trim: true
    },
    additionalCharges: [{
      description: {
        type: String,
        required: true,
        trim: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit-card', 'debit-card', 'mobile-payment', 'gift-card', 'other'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'refunded'],
      default: 'pending'
    },
    tip: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  
  // ===== COSTS =====
  costs: {
    // Barber cost (provided by frontend)
    barber: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Material costs (calculated by backend)
    materials: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Overhead cost (provided by frontend)
    overhead: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Additional costs (provided by frontend)
    additional: [{
      description: {
        type: String,
        required: true,
        trim: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    
    // Total cost (calculated by backend from all costs above)
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // ===== MATERIALS USED =====
  materials: [{
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantityUsed: {
      type: Number,
      required: true,
      min: 0.01
    },
    unit: {
      type: String,
      required: true
    },
    costPerUnit: {
      type: Number,
      required: true,
      min: 0
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // ===== SCHEDULING =====
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [300, 'Duration cannot exceed 5 hours']
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  
  // ===== NOTES =====
  clientNotes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  barberNotes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  internalNotes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // ===== FOLLOW-UP =====
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // ===== RATING & REVIEW =====
  rating: {
    score: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    review: {
      type: String,
      maxlength: 500,
      trim: true
    },
    reviewedAt: {
      type: Date
    }
  },
  
  // ===== AUDIT =====
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // ===== TIMELINE =====
  timeline: [{
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled', 'no-show'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      maxlength: 500,
      trim: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
  
}, {
  timestamps: true
});

// ===== INDEXES =====
serviceSchema.index({ serviceNumber: 1 });
serviceSchema.index({ 'client._id': 1 });
serviceSchema.index({ 'barber._id': 1 });
serviceSchema.index({ 'hairstyle._id': 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ scheduledDate: 1 });
serviceSchema.index({ startTime: 1 });
serviceSchema.index({ 'pricing.paymentStatus': 1 });

// ===== COMPOUND INDEXES =====
serviceSchema.index({ 'barber._id': 1, status: 1 });
serviceSchema.index({ scheduledDate: 1, status: 1 });
serviceSchema.index({ startTime: 1, status: 1 });

// ===== VIRTUALS =====
serviceSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

serviceSchema.virtual('isActive').get(function() {
  return ['pending', 'in-progress'].includes(this.status);
});

serviceSchema.virtual('durationHours').get(function() {
  if (!this.duration) return '0h 0m';
  return `${Math.floor(this.duration / 60)}h ${this.duration % 60}m`;
});

serviceSchema.virtual('formattedPrice').get(function() {
  return `$${this.pricing.totalPrice.toFixed(2)}`;
});

// ===== VALIDATION HELPERS =====
// serviceSchema.methods.canStart = function() {
//   return this.status === 'pending' || this.status === 'in-progress';
// };

// serviceSchema.methods.canComplete = function() {
//   return this.status === 'in-progress' || this.status === 'pending';
// };

// serviceSchema.methods.canCancel = function() {
//   return this.status !== 'completed' && this.status !== 'cancelled';
// };

// serviceSchema.methods.canAddRating = function() {
//   return this.status === 'completed';
// };

// ===== PRE-SAVE MIDDLEWARE =====
serviceSchema.pre('save', async function() {
  // 1. Generate service number if new
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = await mongoose.model('Service').countDocuments();
    this.serviceNumber = `SRV-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // 2. Update timeline when status changes
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      date: new Date(),
      updatedBy: this.updatedBy
    });
  }
  
  // 3. Calculate total price
  if (this.isModified('pricing.basePrice') || 
      this.isModified('pricing.discount') || 
      this.isModified('pricing.additionalCharges')) {
    
    let total = this.pricing.basePrice || 0;
    
    // Apply discount
    if (this.pricing.discount > 0) {
      if (this.pricing.discountType === 'percentage') {
        total = total * (1 - this.pricing.discount / 100);
      } else {
        total = total - this.pricing.discount;
      }
    }
    
    // Add additional charges
    if (this.pricing.additionalCharges && this.pricing.additionalCharges.length > 0) {
      this.pricing.additionalCharges.forEach(charge => {
        total += charge.amount;
      });
    }
    
    this.pricing.totalPrice = Math.max(0, total);
  }
  
  // 4. Calculate material costs and total costs
  if (this.isModified('materials') || this.isModified('costs')) {
    // Calculate material costs from materials array
    let materialCost = 0;
    if (this.materials && this.materials.length > 0) {
      this.materials.forEach(material => {
        materialCost += material.totalCost || 0;
      });
    }
    this.costs.materials = materialCost;
    
    // Calculate total cost (sum of all costs)
    let totalCost = 0;
    totalCost += this.costs.barber || 0;
    totalCost += this.costs.materials || 0;
    totalCost += this.costs.overhead || 0;
    
    if (this.costs.additional && this.costs.additional.length > 0) {
      this.costs.additional.forEach(cost => {
        totalCost += cost.amount || 0;
      });
    }
    
    this.costs.total = totalCost;
  }
  
  // 5. Set start and end times
  if (this.scheduledDate && this.scheduledTime) {
    const [hours, minutes] = this.scheduledTime.split(':').map(Number);
    const startDateTime = new Date(this.scheduledDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    this.startTime = startDateTime;
    
    const endDateTime = new Date(startDateTime);
    const duration = this.duration || 30;
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);
    this.endTime = endDateTime;
  }
  
  // next();
});

// ===== STATIC METHODS =====
serviceSchema.statics.getTodayServices = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    scheduledDate: {
      $gte: today,
      $lt: tomorrow
    }
  }).sort({ scheduledTime: 1 });
};

serviceSchema.statics.getByBarber = async function(barberId, date) {
  const query = { 'barber._id': barberId };
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.scheduledDate = { $gte: start, $lt: end };
  }
  return this.find(query).sort({ scheduledTime: 1 });
};

serviceSchema.statics.getByClient = async function(clientId) {
  return this.find({ 'client._id': clientId })
    .sort({ scheduledDate: -1 });
};

// ===== INSTANCE METHODS =====
serviceSchema.methods.complete = async function(notes) {
  this.status = 'completed';
  this.barberNotes = notes || this.barberNotes;
  this.completedBy = this.updatedBy;
  this.timeline.push({
    status: 'completed',
    date: new Date(),
    note: notes || 'Service completed',
    updatedBy: this.updatedBy
  });
  return this.save();
};

serviceSchema.methods.cancel = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = this.updatedBy;
  this.timeline.push({
    status: 'cancelled',
    date: new Date(),
    note: reason || 'Service cancelled',
    updatedBy: this.updatedBy
  });
  return this.save();
};

serviceSchema.methods.start = async function() {
  this.status = 'in-progress';
  this.timeline.push({
    status: 'in-progress',
    date: new Date(),
    updatedBy: this.updatedBy
  });
  return this.save();
};

serviceSchema.methods.addNote = async function(note, type) {
  if (type === 'client') this.clientNotes = note;
  else if (type === 'barber') this.barberNotes = note;
  else this.internalNotes = note;
  return this.save();
};

serviceSchema.methods.addRating = async function(score, review) {
  this.rating.score = score;
  this.rating.review = review;
  this.rating.reviewedAt = new Date();
  return this.save();
};

serviceSchema.methods.updateStatus = async function(newStatus, note) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    date: new Date(),
    note: note || `Status changed to ${newStatus}`,
    updatedBy: this.updatedBy
  });
  return this.save();
};

// ===== TO JSON CONFIGURATION =====
serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Service', serviceSchema);