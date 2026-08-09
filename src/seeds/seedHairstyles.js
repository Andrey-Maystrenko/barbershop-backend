const mongoose = require('mongoose');
const Hairstyle = require('../models/Hairstyle');
require('dotenv').config();

const seedHairstyles = [
  {
    name: 'Classic Taper Cut',
    category: 'Classic Cut',
    description: 'Traditional taper cut with scissors and clipper work. Clean, professional look suitable for any occasion.',
    price: 35,
    duration: 30,
    gender: 'Men',
    difficulty: 'Intermediate',
    popularity: 85,
    tags: ['professional', 'classic', 'business'],
    aftercare: 'Comb daily and visit every 2-3 weeks to maintain shape.'
  },
  {
    name: 'Skin Fade',
    category: 'Fade',
    description: 'Modern skin fade with seamless transition from skin to longer hair on top. Perfect for contemporary style.',
    price: 45,
    duration: 45,
    gender: 'Men',
    difficulty: 'Expert',
    popularity: 95,
    tags: ['trendy', 'modern', 'fade'],
    aftercare: 'Use quality pomade and visit barber every 1-2 weeks for maintenance.'
  },
  {
    name: 'Beard Trim & Shape',
    category: 'Beard',
    description: 'Professional beard trimming and shaping to complement your style. Includes hot towel treatment.',
    price: 25,
    duration: 20,
    gender: 'Men',
    difficulty: 'Intermediate',
    popularity: 78,
    tags: ['beard', 'grooming', 'maintenance'],
    aftercare: 'Use beard oil daily and brush to maintain shape.'
  },
  {
    name: 'Hot Towel Shave',
    category: 'Shave',
    description: 'Luxurious straight razor shave with hot towels, pre-shave oil, and soothing aftershave balm.',
    price: 40,
    duration: 35,
    gender: 'Men',
    difficulty: 'Expert',
    popularity: 72,
    tags: ['luxury', 'traditional', 'pampering'],
    aftercare: 'Use gentle moisturizer and avoid sun exposure for 24 hours.'
  },
  {
    name: 'Hair Coloring (Full)',
    category: 'Coloring',
    description: 'Full head professional hair coloring with premium products. Consultation included.',
    price: 85,
    duration: 90,
    gender: 'All',
    difficulty: 'Expert',
    popularity: 65,
    tags: ['color', 'makeover', 'premium'],
    aftercare: 'Use color-safe shampoo and avoid washing for 48 hours.'
  },
  {
    name: 'Kids Haircut',
    category: 'Kids',
    description: 'Fun and patient haircut experience for children ages 3-12. Includes lollipop!',
    price: 25,
    duration: 20,
    gender: 'Kids',
    difficulty: 'Beginner',
    popularity: 60,
    tags: ['kids', 'family', 'friendly'],
    aftercare: 'Regular trims every 4-6 weeks to maintain style.'
  },
  {
    name: 'Modern Pompadour',
    category: 'Modern Cut',
    description: 'Stylish pompadour with volume on top and faded sides. Perfect for a bold look.',
    price: 50,
    duration: 40,
    gender: 'Men',
    difficulty: 'Advanced',
    popularity: 82,
    tags: ['trendy', 'volume', 'style'],
    aftercare: 'Use strong hold pomade and blow-dry for best results.'
  },
  {
    name: 'Women\'s Short Cut',
    category: 'Modern Cut',
    description: 'Chic and modern short haircut for women, including styling and consultation.',
    price: 55,
    duration: 45,
    gender: 'Women',
    difficulty: 'Advanced',
    popularity: 70,
    tags: ['women', 'chic', 'short'],
    aftercare: 'Visit every 4-6 weeks to maintain the shape.'
  },
  {
    name: 'Scalp Treatment',
    category: 'Treatment',
    description: 'Deep conditioning scalp treatment to promote healthy hair growth and relaxation.',
    price: 30,
    duration: 25,
    gender: 'All',
    difficulty: 'Beginner',
    popularity: 55,
    tags: ['wellness', 'treatment', 'relaxation'],
    aftercare: 'Use recommended products for best long-term results.'
  },
  {
    name: 'Celebrity Style Copy',
    category: 'Styling',
    description: 'Copy your favorite celebrity hairstyle. Bring a photo and we\'ll recreate it perfectly.',
    price: 60,
    duration: 50,
    gender: 'All',
    difficulty: 'Expert',
    popularity: 75,
    tags: ['celebrity', 'custom', 'premium'],
    aftercare: 'Follow personalized styling advice provided during consultation.'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
    console.log('✅ Connected to MongoDB');
    
    // Delete existing data
    await Hairstyle.deleteMany({});
    console.log('🗑️  Cleared existing hairstyles');
    
    // Insert seed data
    const inserted = await Hairstyle.insertMany(seedHairstyles);
    console.log(`✅ Added ${inserted.length} hairstyles to the database`);
    
    console.log('\n📋 Hairstyles added:');
    inserted.forEach(style => {
      console.log(`- ${style.name} (${style.category}) - $${style.price} - ${style.duration}min`);
    });
    
    // Show categories summary
    const categories = await Hairstyle.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Summary by category:');
    categories.forEach(cat => {
      console.log(`- ${cat._id}: ${cat.count} styles`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

seedDatabase();