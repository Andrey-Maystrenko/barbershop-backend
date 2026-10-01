const Service = require('../models/Service');
const Barber = require('../models/Barber');
const Hairstyle = require('../models/Hairstyle');
const Material = require('../models/Material');

// ===== CREATE SERVICE =====
exports.createService = async (req, res) => {
  try {
    const {
      client,
      barber,
      hairstyle,
      materials,
      operations,
      scheduledDate,
      scheduledTime,
      costs,
      pricing,
      notes
    } = req.body;

    // Validate barber exists
    const barberExists = await Barber.findById(barber._id);
    if (!barberExists) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    // Validate hairstyle exists
    const hairstyleExists = await Hairstyle.findById(hairstyle._id);
    if (!hairstyleExists) {
      return res.status(404).json({
        success: false,
        message: 'Hairstyle not found'
      });
    }

    // ===== ONLY CALCULATION ON BACKEND: MATERIAL COSTS =====
    const validatedMaterials = [];
    let materialCost = 0;

    if (materials && materials.length > 0) {
      for (const item of materials) {
        const material = await Material.findById(item.materialId);
        if (!material) {
          return res.status(404).json({
            success: false,
            message: `Material ${item.materialId} not found`
          });
        }

        // Check if enough stock
        if (material.quantity < item.quantityUsed) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${material.name}. Available: ${material.quantity}, Required: ${item.quantityUsed}`
          });
        }

        // Deduct from inventory
        await material.useStock(
          item.quantityUsed,
          `Used for service - ${hairstyleExists.name}`,
          req.user?._id
        );

        // Calculate total cost for this material
        const totalCost = material.price * item.quantityUsed;
        materialCost += totalCost;

        validatedMaterials.push({
          materialId: material._id,
          name: material.name,
          quantityUsed: item.quantityUsed,
          unit: material.unit,
          costPerUnit: material.price,
          totalCost: totalCost
        });
      }
    }

    // ===== VALIDATE OPERATIONS =====
    const validatedOperations = [];

    if (operations && operations.length > 0) {
      const Operation = require('../models/Operation');

      for (const item of operations) {
        const operation = await Operation.findById(item.operationId);
        if (!operation) {
          return res.status(404).json({
            success: false,
            message: `Operation ${item.operationId} not found`
          });
        }

        validatedOperations.push({
          operationId: operation._id,
          name: operation.name,
          category: operation.category,
          duration: operation.duration,
          price: operation.price
        });
      }
    }

    // ===== BUILD SERVICE DATA =====
    // All costs come from frontend EXCEPT materials (calculated above)
    const serviceData = {
      // Client
      client: {
        _id: client._id,
        name: client.name,
        email: client.email || '',
        phone: client.phone
      },

      // Barber
      barber: {
        _id: barberExists._id,
        name: barberExists.fullName || `${barberExists.firstName} ${barberExists.lastName}`,
        specialization: barberExists.specialization
      },

      // Hairstyle
      hairstyle: {
        _id: hairstyleExists._id,
        name: hairstyleExists.name,
        category: hairstyleExists.category,
        price: hairstyleExists.price,
        duration: hairstyleExists.duration || 30
      },

      // Pricing (from frontend)
      pricing: {
        basePrice: pricing?.basePrice || hairstyleExists.price,
        discount: pricing?.discount || 0,
        discountType: pricing?.discountType || 'percentage',
        discountReason: pricing?.discountReason || '',
        additionalCharges: pricing?.additionalCharges || [],
        totalPrice: pricing?.totalPrice || hairstyleExists.price,
        paymentMethod: pricing?.paymentMethod || 'cash',
        paymentStatus: pricing?.paymentStatus || 'pending',
        tip: pricing?.tip || 0
      },

      // Costs (barber, overhead, additional from frontend; materials calculated)
      costs: {
        barber: costs?.barber || 0,
        materials: materialCost,  // ← ONLY CALCULATION
        overhead: costs?.overhead || 0,
        additional: costs?.additional || [],
        total: 0  // Will be calculated in pre-save
      },

      // Materials with calculated costs
      materials: validatedMaterials,

      // Operations
      operations: validatedOperations,

      // Scheduling
      scheduledDate: new Date(scheduledDate),
      scheduledTime: scheduledTime,
      duration: hairstyleExists.duration || 30,

      // Notes
      clientNotes: notes?.client || '',
      barberNotes: notes?.barber || '',
      internalNotes: notes?.internal || '',

      // Audit
      createdBy: req.user?._id,
      updatedBy: req.user?._id
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// ===== GET ALL SERVICES =====
exports.getAllServices = async (req, res) => {
  try {
    const { status, barberId, clientId, startDate, endDate, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (barberId) filter['barber._id'] = barberId;
    if (clientId) filter['client._id'] = clientId;
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const services = await Service.find(filter)
      .sort({ scheduledDate: -1, scheduledTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// ===== GET SERVICE BY ID =====
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// ===== UPDATE SERVICE =====
exports.updateService = async (req, res) => {
  try {
    // If materials are being updated, recalculate material costs
    if (req.body.materials) {
      let materialCost = 0;
      for (const item of req.body.materials) {
        const material = await Material.findById(item.materialId);
        if (material) {
          const totalCost = material.price * item.quantityUsed;
          item.totalCost = totalCost;
          materialCost += totalCost;
        }
      }

      // Update material costs in the request body
      if (!req.body.costs) req.body.costs = {};
      req.body.costs.materials = materialCost;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user?._id },
      {
        new: true,
        runValidators: true
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// ===== DELETE SERVICE =====
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

// ===== GET TODAY'S SERVICES =====
exports.getTodayServices = async (req, res) => {
  try {
    const services = await Service.getTodayServices();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s services',
      error: error.message
    });
  }
};

// ===== GET SERVICES BY BARBER =====
exports.getServicesByBarber = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { date } = req.query;

    const services = await Service.getByBarber(barberId, date);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching barber services',
      error: error.message
    });
  }
};

// ===== GET SERVICES BY CLIENT =====
exports.getServicesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const services = await Service.getByClient(clientId);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching client services',
      error: error.message
    });
  }
};

// ===== COMPLETE SERVICE =====
exports.completeService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.updatedBy = req.user?._id;
    await service.complete(req.body.notes);

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service completed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error completing service',
      error: error.message
    });
  }
};

// ===== CANCEL SERVICE =====
exports.cancelService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.updatedBy = req.user?._id;
    await service.cancel(req.body.reason);

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling service',
      error: error.message
    });
  }
};

// ===== START SERVICE =====
exports.startService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.updatedBy = req.user?._id;
    await service.start();

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service started successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error starting service',
      error: error.message
    });
  }
};

// ===== ADD RATING =====
exports.addRating = async (req, res) => {
  try {
    const { score, review } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.addRating(score, review);

    res.status(200).json({
      success: true,
      data: service,
      message: 'Rating added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
};