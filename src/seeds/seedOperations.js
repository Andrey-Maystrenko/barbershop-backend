const mongoose = require('mongoose');
const Operation = require('../models/Operation');
require('dotenv').config();

const seedOperations = [
    {
        name: 'Classic Haircut',
        category: 'Haircut',
        description: 'Traditional haircut with scissors and clippers',
        duration: 30,
        price: 35,
        difficulty: 'Intermediate',
        tags: ['classic', 'haircut', 'basic']
    },
    {
        name: 'Fade Cut',
        category: 'Haircut',
        description: 'Modern fade with seamless blending',
        duration: 45,
        price: 45,
        difficulty: 'Advanced',
        tags: ['fade', 'modern', 'trendy']
    },
    {
        name: 'Buzz Cut',
        category: 'Haircut',
        description: 'Short buzzed haircut with clippers',
        duration: 15,
        price: 20,
        difficulty: 'Beginner',
        tags: ['short', 'quick', 'basic']
    },
    {
        name: 'Kids Haircut',
        category: 'Haircut',
        description: 'Gentle haircut for children',
        duration: 20,
        price: 25,
        difficulty: 'Intermediate',
        tags: ['kids', 'family', 'gentle']
    },
    {
        name: 'Beard Trim',
        category: 'Beard',
        description: 'Trim and shape beard',
        duration: 20,
        price: 20,
        difficulty: 'Intermediate',
        tags: ['beard', 'trim', 'grooming']
    },
    {
        name: 'Beard Shaping',
        category: 'Beard',
        description: 'Full beard shaping with razor lines',
        duration: 30,
        price: 30,
        difficulty: 'Advanced',
        tags: ['beard', 'shaping', 'detailed']
    },
    {
        name: 'Hot Towel Shave',
        category: 'Shaving',
        description: 'Traditional hot towel straight razor shave',
        duration: 40,
        price: 40,
        difficulty: 'Expert',
        tags: ['shave', 'traditional', 'luxury']
    },
    {
        name: 'Head Shave',
        category: 'Shaving',
        description: 'Complete head shave with razor',
        duration: 30,
        price: 35,
        difficulty: 'Advanced',
        tags: ['shave', 'head', 'smooth']
    },
    {
        name: 'Hair Coloring',
        category: 'Coloring',
        description: 'Full hair coloring service',
        duration: 90,
        price: 85,
        difficulty: 'Expert',
        tags: ['color', 'dye', 'premium']
    },
    {
        name: 'Hair Highlights',
        category: 'Coloring',
        description: 'Partial highlights for hair',
        duration: 120,
        price: 110,
        difficulty: 'Expert',
        tags: ['highlights', 'color', 'premium']
    },
    {
        name: 'Hair Styling',
        category: 'Styling',
        description: 'Professional hair styling for events',
        duration: 30,
        price: 30,
        difficulty: 'Advanced',
        tags: ['styling', 'event', 'special']
    },
    {
        name: 'Pompadour Styling',
        category: 'Styling',
        description: 'Classic pompadour with volume',
        duration: 25,
        price: 35,
        difficulty: 'Advanced',
        tags: ['pompadour', 'volume', 'classic']
    },
    {
        name: 'Scalp Massage',
        category: 'Massage',
        description: 'Relaxing scalp massage treatment',
        duration: 20,
        price: 25,
        difficulty: 'Beginner',
        tags: ['massage', 'relax', 'wellness']
    },
    {
        name: 'Hair Treatment',
        category: 'Treatment',
        description: 'Deep conditioning hair treatment',
        duration: 30,
        price: 40,
        difficulty: 'Intermediate',
        tags: ['treatment', 'conditioning', 'care']
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
        console.log('✅ Connected to MongoDB');

        await Operation.deleteMany({});
        console.log('🗑️  Cleared existing operations');

        const inserted = await Operation.insertMany(seedOperations);
        console.log(`✅ Added ${inserted.length} operations to the database`);

        console.log('\n📋 Operations added:');
        inserted.forEach(op => {
            console.log(`- ${op.name} (${op.category}) - $${op.price} - ${op.duration}min`);
        });

        // Summary by category
        const stats = await Operation.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📊 Summary by category:');
        stats.forEach(cat => {
            console.log(`- ${cat._id}: ${cat.count} operations`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};

seedDatabase();