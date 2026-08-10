const mongoose = require('mongoose');
const Material = require('../models/Material');
require('dotenv').config();

const seedMaterials = [
  {
    name: 'Professional Shampoo 500ml',
    category: 'Hair Products',
    description: 'High-quality professional shampoo for all hair types',
    quantity: 25,
    unit: 'ml',
    price: 15.99,
    reorderLevel: 5,
    reorderQuantity: 10,
    supplier: {
      name: 'HairPro Supplies',
      contact: {
        phone: '+1234567890',
        email: 'orders@hairpro.com'
      }
    },
    barcode: '1234567890123',
    location: 'A1-Shelf3',
    notes: 'Popular with clients, keep well stocked'
  },
  {
    name: 'Premium Hair Wax',
    category: 'Styling',
    description: 'Strong hold hair wax with matte finish',
    quantity: 15,
    unit: 'g',
    price: 12.50,
    reorderLevel: 3,
    reorderQuantity: 8,
    supplier: {
      name: 'StylePro Distributors',
      contact: {
        phone: '+1987654321',
        email: 'info@stylepro.com'
      }
    },
    barcode: '9876543210987',
    location: 'B2-Shelf1',
    notes: 'Best seller among male clients'
  },
  {
    name: 'Disposable Gloves (Box)',
    category: 'Disposable',
    description: 'Premium latex-free gloves for hygienic services',
    quantity: 8,
    unit: 'pack',
    price: 8.99,
    reorderLevel: 2,
    reorderQuantity: 5,
    supplier: {
      name: 'MediSupply Co',
      contact: {
        phone: '+1555123456',
        email: 'orders@medisupply.com'
      }
    },
    barcode: '4567890123456',
    location: 'C3-Shelf2',
    notes: 'Essential for all services'
  },
  {
    name: 'Beard Oil 30ml',
    category: 'Beard',
    description: 'Nourishing beard oil with natural ingredients',
    quantity: 12,
    unit: 'ml',
    price: 18.99,
    reorderLevel: 4,
    reorderQuantity: 6,
    supplier: {
      name: 'BeardCare Labs',
      contact: {
        phone: '+1777888999',
        email: 'sales@beardcare.com'
      }
    },
    barcode: '5678901234567',
    location: 'D1-Shelf4',
    notes: 'Premium product with high margin'
  },
  {
    name: 'Hair Coloring Kit',
    category: 'Coloring',
    description: 'Professional hair coloring kit for all shades',
    quantity: 6,
    unit: 'pack',
    price: 45.00,
    reorderLevel: 2,
    reorderQuantity: 3,
    supplier: {
      name: 'ColorPro International',
      contact: {
        phone: '+1666777888',
        email: 'orders@colorpro.com'
      }
    },
    expiryDate: new Date('2026-12-31'),
    barcode: '6789012345678',
    location: 'E1-Shelf2',
    notes: 'Check expiry dates regularly'
  },
  {
    name: 'Barber Scissors Set',
    category: 'Tools',
    description: 'Professional barber scissors set with case',
    quantity: 3,
    unit: 'pair',
    price: 89.99,
    reorderLevel: 1,
    reorderQuantity: 2,
    supplier: {
      name: 'Precision Tools Inc',
      contact: {
        phone: '+1444555666',
        email: 'info@precisiontools.com'
      }
    },
    barcode: '7890123456789',
    location: 'F1-Shelf1',
    notes: 'High-end equipment, handle with care'
  },
  {
    name: 'Towels (Pack of 12)',
    category: 'Disposable',
    description: 'High-quality barber towels, pack of 12',
    quantity: 10,
    unit: 'pack',
    price: 22.99,
    reorderLevel: 3,
    reorderQuantity: 5,
    supplier: {
      name: 'LinenPro Supplies',
      contact: {
        phone: '+1222333444',
        email: 'orders@linenpro.com'
      }
    },
    barcode: '8901234567890',
    location: 'G2-Shelf3',
    notes: 'Restock monthly'
  },
  {
    name: 'Hair Clipper Oil',
    category: 'Tools',
    description: 'Lubricating oil for clipper maintenance',
    quantity: 20,
    unit: 'ml',
    price: 9.99,
    reorderLevel: 5,
    reorderQuantity: 10,
    supplier: {
      name: 'ToolMasters',
      contact: {
        phone: '+1555666777',
        email: 'info@toolmasters.com'
      }
    },
    barcode: '9012345678901',
    location: 'F2-Shelf2',
    notes: 'Essential for equipment maintenance'
  },
  {
    name: 'Aftershave Balm',
    category: 'Shaving',
    description: 'Soothing aftershave balm with natural ingredients',
    quantity: 18,
    unit: 'ml',
    price: 14.50,
    reorderLevel: 4,
    reorderQuantity: 8,
    supplier: {
      name: 'SkinCare Co',
      contact: {
        phone: '+1444777888',
        email: 'orders@skincareco.com'
      }
    },
    barcode: '0123456789012',
    location: 'H1-Shelf3',
    notes: 'Popular with clients after shave services'
  },
  {
    name: 'Disposable Razor Blades',
    category: 'Shaving',
    description: 'Premium quality disposable razor blades for shaving',
    quantity: 50,
    unit: 'piece',
    price: 0.99,
    reorderLevel: 10,
    reorderQuantity: 20,
    supplier: {
      name: 'SharpEdge Products',
      contact: {
        phone: '+1333444555',
        email: 'orders@sharpedge.com'
      }
    },
    barcode: '1234509876543',
    location: 'H2-Shelf1',
    notes: 'Always use fresh blade per client'
  },
  {
    name: 'Hair Gel - Strong Hold',
    category: 'Styling',
    description: 'Extra strong hold hair gel with shine finish',
    quantity: 9,
    unit: 'ml',
    price: 11.99,
    reorderLevel: 3,
    reorderQuantity: 6,
    supplier: {
      name: 'StylePro Distributors',
      contact: {
        phone: '+1987654321',
        email: 'info@stylepro.com'
      }
    },
    barcode: '2345610987654',
    location: 'B2-Shelf3',
    notes: 'Restock before weekends'
  },
  {
    name: 'Disinfectant Spray',
    category: 'Cleaning',
    description: 'Professional disinfectant spray for equipment',
    quantity: 7,
    unit: 'ml',
    price: 16.99,
    reorderLevel: 2,
    reorderQuantity: 4,
    supplier: {
      name: 'CleanPro Supplies',
      contact: {
        phone: '+1666555444',
        email: 'orders@cleanpro.com'
      }
    },
    barcode: '3456721098765',
    location: 'I1-Shelf2',
    notes: 'Essential for hygiene standards'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
    console.log('✅ Connected to MongoDB');
    
    // Очистка существующих материалов
    await Material.deleteMany({});
    console.log('🗑️  Cleared existing materials');
    
    // Вставка данных
    const inserted = await Material.insertMany(seedMaterials);
    console.log(`✅ Added ${inserted.length} materials to the database`);
    
    console.log('\n📋 Materials added:');
    inserted.forEach(mat => {
      const status = mat.quantity <= mat.reorderLevel ? '⚠️ LOW STOCK' : '✅ In Stock';
      console.log(`- ${mat.name} (${mat.category}) - ${mat.quantity} ${mat.unit} - ${status}`);
    });
    
    // Статистика по категориям
    const stats = await Material.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Summary by category:');
    stats.forEach(cat => {
      console.log(`- ${cat._id}: ${cat.count} items`);
    });
    
    const lowStock = await Material.getLowStockItems();
    console.log(`\n⚠️ Low stock items: ${lowStock.length}`);
    lowStock.forEach(item => {
      console.log(`  - ${item.name}: ${item.quantity} ${item.unit} (reorder at ${item.reorderLevel})`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

seedDatabase();