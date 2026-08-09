const express = require('express');
const router = express.Router();
const {
  getAllBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber
} = require('../controllers/barberController');

router.route('/')
  .get(getAllBarbers)
  .post(createBarber);

router.route('/:id')
  .get(getBarberById)
  .put(updateBarber)
  .delete(deleteBarber);

module.exports = router;