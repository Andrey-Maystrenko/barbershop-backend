const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
    // ===== BASIC INFO =====
    name: {
        type: String,
        required: [true, 'Operation name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Haircut',
            'Beard',
            'Shaving',
            'Coloring',
            'Styling',
            'Treatment',
            'Massage',
            'Other'
        ],
        // enum: [
        //     'Haircut',
        //     'Washing',
        //     'Drying',
        //     'Coloring',
        //     'Styling',
        //     'Treatment',
        //     'Massage',
        //     'Other'
        // ],
        default: 'Other'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true
    },

    // ===== DURATION & PRICE =====
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute'],
        max: [300, 'Duration cannot exceed 300 minutes'],
        comment: 'Duration in minutes'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },

    // ===== DIFFICULTY & SKILL =====
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
    },

    // ===== STATUS =====
    isActive: {
        type: Boolean,
        default: true
    },

    // ===== TAGS =====
    tags: {
        type: [String],
        default: []
    },

    // ===== NOTES =====
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
        trim: true
    }

}, {
    timestamps: true
});

// ===== INDEXES =====
operationSchema.index({ name: 1 });
operationSchema.index({ category: 1 });
operationSchema.index({ price: 1 });
operationSchema.index({ duration: 1 });
operationSchema.index({ isActive: 1 });

// ===== VIRTUALS =====
operationSchema.virtual('durationFormatted').get(function () {
    if (!this.duration) return '0m';
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

operationSchema.virtual('formattedPrice').get(function () {
    return `$${this.price.toFixed(2)}`;
});

// ===== STATIC METHODS =====
operationSchema.statics.getActive = async function () {
    return this.find({ isActive: true }).sort({ name: 1 });
};

operationSchema.statics.getByCategory = async function (category) {
    return this.find({ category, isActive: true }).sort({ name: 1 });
};

// ===== TO JSON CONFIGURATION =====
operationSchema.set('toJSON', { virtuals: true });
operationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Operation', operationSchema);