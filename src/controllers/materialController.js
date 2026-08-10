const Material = require('../models/Material');

// Получить все материалы
exports.getAllMaterials = async (req, res) => {
  try {
    const { 
      category, 
      isLowStock, 
      isActive,
      search,
      minPrice,
      maxPrice
    } = req.query;
    
    const filter = {};
    
    if (category) filter.category = category;
    if (isLowStock !== undefined) filter.isLowStock = isLowStock === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const materials = await Material.find(filter)
      .sort({ category: 1, name: 1 })
      .populate('usedInServices.hairstyleId', 'name category');
    
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching materials',
      error: error.message
    });
  }
};

// Получить материал по ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('usedInServices.hairstyleId', 'name category price');
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching material',
      error: error.message
    });
  }
};

// Создать новый материал
exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create(req.body);
    
    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Material with this name or barcode already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating material',
      error: error.message
    });
  }
};

// Обновить материал
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Material with this name or barcode already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error updating material',
      error: error.message
    });
  }
};

// Удалить материал
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting material',
      error: error.message
    });
  }
};

// Получить материалы с низким запасом
exports.getLowStockMaterials = async (req, res) => {
  try {
    const materials = await Material.getLowStockItems();
    
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock materials',
      error: error.message
    });
  }
};

// Получить материалы по категории
exports.getMaterialsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const materials = await Material.getByCategory(category);
    
    res.status(200).json({
      success: true,
      count: materials.length,
      category: category,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching materials by category',
      error: error.message
    });
  }
};

// Добавить количество материала
exports.addStock = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    
    await material.addStock(amount, reason, req.user?.id);
    
    res.status(200).json({
      success: true,
      data: material,
      message: `Added ${amount} ${material.unit} to ${material.name}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding stock',
      error: error.message
    });
  }
};

// Использовать количество материала
exports.useStock = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    
    await material.useStock(amount, reason, req.user?.id);
    
    res.status(200).json({
      success: true,
      data: material,
      message: `Used ${amount} ${material.unit} from ${material.name}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error using stock',
      error: error.message
    });
  }
};

// Получить статистику по материалам
exports.getMaterialStats = async (req, res) => {
  try {
    const totalItems = await Material.countDocuments({ isActive: true });
    const lowStockItems = await Material.countDocuments({ isLowStock: true, isActive: true });
    const outOfStock = await Material.countDocuments({ 
      quantity: 0, 
      isActive: true 
    });
    
    const categoryStats = await Material.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        avgPrice: { $avg: '$price' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    const totalValue = await Material.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
      }}
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalItems,
        lowStockItems,
        outOfStock,
        totalValue: totalValue[0]?.totalValue || 0,
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching material stats',
      error: error.message
    });
  }
};