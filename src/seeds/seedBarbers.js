const mongoose = require('mongoose');
const Barber = require('../models/Barber');
require('dotenv').config();

const seedBarbers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@barbershop.com',
    phone: '+1234567890',
    specialization: ['Fade', 'Beard Trim'],
    experience: 5,
    rating: 4.8,
    bio: 'Expert barber specializing in modern fades and beard styling',
    schedule: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '15:00' },
      sunday: { start: 'closed', end: 'closed' }
    }
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@barbershop.com',
    phone: '+1987654321',
    specialization: ['Classic Cut', 'Coloring', 'Hot Towel Shave'],
    experience: 8,
    rating: 4.9,
    bio: 'Master barber with expertise in classic cuts and hair coloring',
    schedule: {
      monday: { start: '10:00', end: '19:00' },
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '14:00' },
      sunday: { start: 'closed', end: 'closed' }
    }
  },
  {
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@barbershop.com',
    phone: '+1123456789',
    specialization: ['Fade', 'Kids Cut', 'Beard Trim'],
    experience: 3,
    rating: 4.6,
    bio: 'Young talented barber, great with kids and modern styles',
    schedule: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: 'closed', end: 'closed' },
      sunday: { start: 'closed', end: 'closed' }
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
    console.log('✅ Connected to MongoDB');
    
    await Barber.deleteMany({});
    console.log('🗑️  Cleared existing barbers');
    
    const inserted = await Barber.insertMany(seedBarbers);
    console.log(`✅ Added ${inserted.length} barbers to the database`);
    
    console.log('\n📋 Barbers added:');
    inserted.forEach(barber => {
      console.log(`- ${barber.fullName} (${barber.specialization.join(', ')})`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

seedDatabase();