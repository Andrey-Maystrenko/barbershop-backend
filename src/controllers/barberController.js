const Barber = require('../models/Barber');

exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.status(200).json({
      success: true,
      count: barbers.length,
      data: barbers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching barbers',
      error: error.message
    });
  }
};

exports.getBarberById = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching barber',
      error: error.message
    });
  }
};

exports.createBarber = async (req, res) => {
  try {
    const barber = await Barber.create(req.body);
    
    res.status(201).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating barber',
      error: error.message
    });
  }
};

exports.updateBarber = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: barber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating barber',
      error: error.message
    });
  }
};

exports.deleteBarber = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndDelete(req.params.id);
    
    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Barber deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting barber',
      error: error.message
    });
  }
};