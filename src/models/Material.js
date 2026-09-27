const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  // Основная информация
  name: {
    type: String,
    required: [true, 'Название материала обязательно'],
    unique: true,
    trim: true,
    maxlength: [100, 'Название не может превышать 100 символов']
  },
  
  category: {
    type: String,
    required: [true, 'Категория обязательна'],
    enum: [
      'Hair Products',    // Шампуни, кондиционеры, средства для укладки
      'Shaving',          // Средства для бритья
      'Beard',            // Средства для бороды
      'Styling',          // Воски, гели, лаки
      'Coloring',         // Краски, осветлители
      'Tools',            // Ножницы, машинки, расчески
      'Disposable',       // Одноразовые материалы (перчатки, полотенца)
      'Cleaning',         // Средства для уборки и дезинфекции
      'Other'             // Прочее
    ],
    default: 'Other'
  },
  
  description: {
    type: String,
    maxlength: [500, 'Описание не может превышать 500 символов']
  },
  
  // Учет количества
  quantity: {
    type: Number,
    required: [true, 'Количество обязательно'],
    min: [0, 'Количество не может быть отрицательным'],
    default: 0
  },
  
  unit: {
    type: String,
    required: [true, 'Единица измерения обязательна'],
    enum: [
      'ml',       // миллилитры
      'oz',       // унции
      'g',        // граммы
      'kg',       // килограммы
      'bottle',   // бутылка
      'tube',     // тюбик
      'piece',    // штука
      'pack',     // упаковка
      'pair',     // пара
      'set'       // набор
    ],
    default: 'piece'
  },
  
  // Финансовая информация
  price: {
    type: Number,
    min: [0, 'Цена не может быть отрицательной'],
    default: 0
  },
  
  // Информация о поставщике
  supplier: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      phone: String,
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Пожалуйста, введите корректный email']
      },
      address: String
    },
    website: String
  },
  
  // Информация о запасах
  reorderLevel: {
    type: Number,
    min: [0, 'Уровень перезаказа не может быть отрицательным'],
    default: 5,
    comment: 'При достижении этого уровня автоматически создается заказ'
  },
  
  reorderQuantity: {
    type: Number,
    min: [1, 'Количество для перезаказа должно быть больше 0'],
    default: 10,
    comment: 'Количество, которое заказывается при достижении reorderLevel'
  },
  
  // Статусы
  isActive: {
    type: Boolean,
    default: true
  },
  
  isLowStock: {
    type: Boolean,
    default: false
  },
  
  // Дополнительная информация
  expiryDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return value > new Date();
      },
      message: 'Срок годности должен быть в будущем'
    }
  },
  
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  
  location: {
    type: String,
    trim: true,
    comment: 'Место хранения: склад, полка, комната'
  },
  
  notes: {
    type: String,
    maxlength: [500, 'Заметки не могут превышать 500 символов']
  },
  
  // История изменений количества (опционально)
  history: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['received', 'used', 'adjusted', 'wasted'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    previousQuantity: Number,
    newQuantity: Number,
    reason: {
      type: String,
      maxlength: 200
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  
  // Используется в каких услугах (связь с Hairstyle)
  usedInServices: [{
    hairstyleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hairstyle'
    },
    quantityUsed: {
      type: Number,
      min: 0,
      default: 1
    }
  }]
  
}, {
  timestamps: true
});

// Индексы для улучшения производительности
// materialSchema.index({ name: 1 });
materialSchema.index({ category: 1 });
materialSchema.index({ quantity: 1 });
materialSchema.index({ 'supplier.name': 1 });
materialSchema.index({ isLowStock: 1 });
materialSchema.index({ category: 1, isLowStock: 1 });

// Виртуальные поля
materialSchema.virtual('stockStatus').get(function() {
  if (this.quantity <= 0) return 'Out of Stock';
  if (this.quantity <= this.reorderLevel) return 'Low Stock';
  return 'In Stock';
});

materialSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

materialSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return this.expiryDate < new Date();
});

// Статические методы
materialSchema.statics.getLowStockItems = async function() {
  return this.find({
    $expr: { $lte: ['$quantity', '$reorderLevel'] },
    isActive: true
  }).sort({ quantity: 1 });
};

materialSchema.statics.getByCategory = async function(category) {
  return this.find({ category, isActive: true });
};

// Методы экземпляра
materialSchema.methods.updateQuantity = async function(newQuantity, type, reason, userId) {
  const previousQuantity = this.quantity;
  
  // Запись истории
  this.history.push({
    date: new Date(),
    type: type,
    quantity: Math.abs(newQuantity - previousQuantity),
    previousQuantity: previousQuantity,
    newQuantity: newQuantity,
    reason: reason || '',
    userId: userId
  });
  
  // Обновление количества
  this.quantity = newQuantity;
  
  // Обновление статуса низкого запаса
  this.isLowStock = newQuantity <= this.reorderLevel;
  
  await this.save();
  return this;
};

materialSchema.methods.addStock = async function(amount, reason, userId) {
  if (amount <= 0) throw new Error('Количество должно быть больше 0');
  const newQuantity = this.quantity + amount;
  return this.updateQuantity(newQuantity, 'received', reason, userId);
};

materialSchema.methods.useStock = async function(amount, reason, userId) {
  if (amount <= 0) throw new Error('Количество должно быть больше 0');
  if (amount > this.quantity) throw new Error('Недостаточно материала на складе');
  const newQuantity = this.quantity - amount;
  return this.updateQuantity(newQuantity, 'used', reason, userId);
};

// Middleware - обновление isLowStock перед сохранением
// materialSchema.pre('save', function(next) {
//   this.isLowStock = this.quantity <= this.reorderLevel;
//   next();
// });

/// ===== MIDDLEWARE - FIXED VERSION =====
// ✅ CORRECT: Using async/await (no next parameter)
materialSchema.pre('save', async function() {
  // Update low stock status
  this.isLowStock = this.quantity <= this.reorderLevel;
  
  // Check if expired
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.isActive = false;
  }
});

// Middleware - проверка срока годности
materialSchema.pre('save', function() {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.isActive = false;
  }
  // next();
});

module.exports = mongoose.model('Material', materialSchema);