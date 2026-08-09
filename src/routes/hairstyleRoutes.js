const express = require('express');
const router = express.Router();
const {
  getAllHairstyles,
  getHairstyleById,
  createHairstyle,
  updateHairstyle,
  deleteHairstyle,
  getPopularHairstyles,
  getHairstylesByCategory,
  toggleHairstyleStatus,
  bulkCreateHairstyles
} = require('../controllers/hairstyleController');

// Public routes
router.get('/', getAllHairstyles);
router.get('/popular', getPopularHairstyles);
router.get('/category/:category', getHairstylesByCategory);
router.get('/:id', getHairstyleById);

// Admin routes (you can add authentication later)
router.post('/', createHairstyle);
router.post('/bulk', bulkCreateHairstyles);
router.put('/:id', updateHairstyle);
router.patch('/:id/toggle', toggleHairstyleStatus);
router.delete('/:id', deleteHairstyle);

module.exports = router;