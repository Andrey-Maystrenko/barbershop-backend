const express = require('express');
const router = express.Router();
const {
  createOperation,
  getAllOperations,
  getOperationById,
  updateOperation,
  deleteOperation,
  getOperationsByCategory,
  toggleOperationStatus
} = require('../controllers/operationController');

// ===== GET ROUTES =====
router.get('/', getAllOperations);
router.get('/category/:category', getOperationsByCategory);
router.get('/:id', getOperationById);

// ===== POST ROUTES =====
router.post('/', createOperation);

// ===== PUT ROUTES =====
router.put('/:id', updateOperation);

// ===== PATCH ROUTES =====
router.patch('/:id/toggle', toggleOperationStatus);

// ===== DELETE ROUTES =====
router.delete('/:id', deleteOperation);

module.exports = router;