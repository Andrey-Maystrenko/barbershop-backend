const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const barberRoutes = require('./routes/barberRoutes');
const hairstyleRoutes = require('./routes/hairstyleRoutes'); // NEW

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/barbers', barberRoutes);
app.use('/api/hairstyles', hairstyleRoutes); // NEW

// Root route
app.get('/', (req, res) => {
  res.send('Barbershop API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Barbershop server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });