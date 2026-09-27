const mongoose = require('mongoose');
const Client = require('../models/Client');
require('dotenv').config();

const seedClients = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    preferences: {
      notes: 'Prefers classic cuts'
    },
    stats: {
      totalVisits: 12,
      totalSpent: 600,
      lastVisit: new Date('2024-01-15')
    }
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    stats: {
      totalVisits: 5,
      totalSpent: 250,
      lastVisit: new Date('2024-01-10')
    }
  },
  {
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@email.com',
    phone: '+1-555-456-7890',
    address: {
      street: '789 Pine Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    preferences: {
      notes: 'Likes hot towel shave'
    },
    stats: {
      totalVisits: 8,
      totalSpent: 480,
      lastVisit: new Date('2024-01-12')
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1-555-789-1234',
    address: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    stats: {
      totalVisits: 3,
      totalSpent: 150,
      lastVisit: new Date('2024-01-08')
    }
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-234-5678',
    address: {
      street: '654 Maple Dr',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    stats: {
      totalVisits: 6,
      totalSpent: 300,
      lastVisit: new Date('2024-01-14')
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
    console.log('✅ Connected to MongoDB');
    
    await Client.deleteMany({});
    console.log('🗑️  Cleared existing clients');
    
    const inserted = await Client.insertMany(seedClients);
    console.log(`✅ Added ${inserted.length} clients to the database`);
    
    console.log('\n📋 Clients added:');
    inserted.forEach(client => {
      console.log(`- ${client.fullName} (${client.email})`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

seedDatabase();