const Operation = require('../models/Operation');

// ===== CREATE OPERATION =====
exports.createOperation = async (req, res) => {
    try {
        const operation = await Operation.create(req.body);

        res.status(201).json({
            success: true,
            data: operation
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Operation with this name already exists'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error creating operation',
            error: error.message
        });
    }
};

// ===== GET ALL OPERATIONS =====
exports.getAllOperations = async (req, res) => {
    try {
        const {
            category,
            isActive,
            minPrice,
            maxPrice,
            search,
            limit = 50,
            page = 1
        } = req.query;

        const filter = {};

        if (category) filter.category = category;
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

        const skip = (page - 1) * limit;

        const operations = await Operation.find(filter)
            .sort({ category: 1, name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Operation.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: operations.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: operations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching operations',
            error: error.message
        });
    }
};

// ===== GET OPERATION BY ID =====
exports.getOperationById = async (req, res) => {
    try {
        const operation = await Operation.findById(req.params.id);

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: 'Operation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: operation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching operation',
            error: error.message
        });
    }
};

// ===== UPDATE OPERATION =====
exports.updateOperation = async (req, res) => {
    try {
        const operation = await Operation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: 'Operation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: operation
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Operation with this name already exists'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error updating operation',
            error: error.message
        });
    }
};

// ===== DELETE OPERATION =====
exports.deleteOperation = async (req, res) => {
    try {
        const operation = await Operation.findByIdAndDelete(req.params.id);

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: 'Operation not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Operation deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting operation',
            error: error.message
        });
    }
};

// ===== GET OPERATIONS BY CATEGORY =====
exports.getOperationsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const operations = await Operation.getByCategory(category);

        res.status(200).json({
            success: true,
            count: operations.length,
            category: category,
            data: operations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching operations by category',
            error: error.message
        });
    }
};

// ===== TOGGLE ACTIVE STATUS =====
exports.toggleOperationStatus = async (req, res) => {
    try {
        const operation = await Operation.findById(req.params.id);

        if (!operation) {
            return res.status(404).json({
                success: false,
                message: 'Operation not found'
            });
        }

        operation.isActive = !operation.isActive;
        await operation.save();

        res.status(200).json({
            success: true,
            data: operation,
            message: `Operation ${operation.isActive ? 'activated' : 'deactivated'}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling operation status',
            error: error.message
        });
    }
};