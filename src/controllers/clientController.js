const Client = require('../models/Client');

// ===== CREATE CLIENT =====
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    
    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
};

// ===== GET ALL CLIENTS =====
exports.getAllClients = async (req, res) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;
    
    let filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Client.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: clients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

// ===== GET CLIENT BY ID =====
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('preferences.preferredBarber', 'firstName lastName');
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
};

// ===== UPDATE CLIENT =====
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
};

// ===== DELETE CLIENT =====
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};

// ===== ADD VISIT (Used when creating a service) =====
exports.addVisit = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    const { service } = req.body;
    await client.addVisit(service);
    
    res.status(200).json({
      success: true,
      data: client,
      message: 'Visit added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding visit',
      error: error.message
    });
  }
};