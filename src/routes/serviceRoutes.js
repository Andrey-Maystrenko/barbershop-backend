const express = require('express');
const router = express.Router();
const {
 createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getTodayServices,
  getServicesByBarber,
  getServicesByClient,
  completeService,
  cancelService,
  startService,
  addRating
} = require('../controllers/serviceController');

// ===== GET ROUTES =====
router.get('/', getAllServices);
router.get('/today', getTodayServices);
router.get('/barber/:barberId', getServicesByBarber);
router.get('/client/:clientId', getServicesByClient);
router.get('/:id', getServiceById);

// ===== POST ROUTES =====
router.post('/', createService);

// ===== PUT ROUTES =====
router.put('/:id', updateService);

// ===== PATCH ROUTES =====
router.patch('/:id/start', startService);
router.patch('/:id/complete', completeService);
router.patch('/:id/cancel', cancelService);
router.patch('/:id/rating', addRating);

// ===== DELETE ROUTES =====
router.delete('/:id', deleteService);

module.exports = router;