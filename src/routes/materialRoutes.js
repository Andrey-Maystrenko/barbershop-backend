const express = require('express');
const router = express.Router();
const {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getLowStockMaterials,
  getMaterialsByCategory,
  addStock,
  useStock,
  getMaterialStats
} = require('../controllers/materialController');

// Публичные маршруты
router.get('/', getAllMaterials);
router.get('/low-stock', getLowStockMaterials);
router.get('/category/:category', getMaterialsByCategory);
router.get('/stats', getMaterialStats);
router.get('/:id', getMaterialById);

// Админ маршруты (позже добавим авторизацию)
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);
router.patch('/:id/add-stock', addStock);
router.patch('/:id/use-stock', useStock);

module.exports = router;