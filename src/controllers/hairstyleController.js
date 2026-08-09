const Hairstyle = require('../models/Hairstyle');

// Get all hairstyles with filtering
exports.getAllHairstyles = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, gender, isActive } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const hairstyles = await Hairstyle.find(filter)
      .sort({ popularity: -1, name: 1 })
    // .populate('materials.materialId', 'name category');

    res.status(200).json({
      success: true,
      count: hairstyles.length,
      data: hairstyles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hairstyles',
      error: error.message
    });
  }
};

// Get single hairstyle by ID
exports.getHairstyleById = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id)
      .populate('materials.materialId', 'name category quantity');

    if (!hairstyle) {
      return res.status(404).json({
        success: false,
        message: 'Hairstyle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hairstyle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hairstyle',
      error: error.message
    });
  }
};

// Create new hairstyle - FIXED VERSION
// Simplified test version - replace your createHairstyle with this
// exports.createHairstyle = async (req, res) => {
//   console.log('🔥 POST hit!');
//   console.log('📦 Body:', req.body);

//   try {
//     // Basic validation
//     if (!req.body.name || !req.body.category || !req.body.price || !req.body.duration) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: name, category, price, duration'
//       });
//     }

//     const hairstyle = new Hairstyle(req.body);
//     await hairstyle.save();

//     res.status(201).json({
//       success: true,
//       data: hairstyle
//     });
//   } catch (error) {
//     console.error('❌ Error:', error);
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// exports.createHairstyle = async (req, res) => {
//   try {
//     const barber = await Hairstyle.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: barber
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error creating barber',
//       error: error.message
//     });
//   }
// };

exports.createHairstyle = async (req, res) => {
  // console.log('🔥 POST request received!'); // Debug

  try {
    const hairstyle = await Hairstyle.create(req.body);
    // console.log('✅ Created:', hairstyle); // Debug

    res.status(201).json({
      success: true,
      data: hairstyle
    });
  } catch (error) {
    // console.log('❌ Error:', error.message); // Debug
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Hairstyle with this name already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating hairstyle',
      error: error.message
    });
  }
};

// Update hairstyle
exports.updateHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!hairstyle) {
      return res.status(404).json({
        success: false,
        message: 'Hairstyle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hairstyle
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Hairstyle with this name already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error updating hairstyle',
      error: error.message
    });
  }
};

// Delete hairstyle
exports.deleteHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByIdAndDelete(req.params.id);

    if (!hairstyle) {
      return res.status(404).json({
        success: false,
        message: 'Hairstyle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hairstyle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hairstyle',
      error: error.message
    });
  }
};

// Get popular hairstyles
exports.getPopularHairstyles = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const popular = await Hairstyle.getPopular(limit);

    res.status(200).json({
      success: true,
      count: popular.length,
      data: popular
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular hairstyles',
      error: error.message
    });
  }
};

// Get hairstyles by category
exports.getHairstylesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const hairstyles = await Hairstyle.find({
      category: category,
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: hairstyles.length,
      category: category,
      data: hairstyles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hairstyles by category',
      error: error.message
    });
  }
};

// Toggle hairstyle active status
exports.toggleHairstyleStatus = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id);

    if (!hairstyle) {
      return res.status(404).json({
        success: false,
        message: 'Hairstyle not found'
      });
    }

    hairstyle.isActive = !hairstyle.isActive;
    await hairstyle.save();

    res.status(200).json({
      success: true,
      data: hairstyle,
      message: `Hairstyle ${hairstyle.isActive ? 'activated' : 'deactivated'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling hairstyle status',
      error: error.message
    });
  }
};

// Bulk create hairstyles
exports.bulkCreateHairstyles = async (req, res) => {
  try {
    const hairstyles = await Hairstyle.insertMany(req.body);

    res.status(201).json({
      success: true,
      count: hairstyles.length,
      data: hairstyles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating hairstyles',
      error: error.message
    });
  }
};