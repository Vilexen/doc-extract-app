const Vendor = require('../models/Vendor');

// @desc    Get vendors with filtering and pagination
// @route   GET /api/vendors
// @access  Private
exports.getVendors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tax_id: { $regex: search, $options: 'i' } },
        { contact_person: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [vendors, total] = await Promise.all([
      Vendor.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Vendor.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        vendors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Private
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Create vendor
// @route   POST /api/vendors
// @access  Private
exports.createVendor = async (req, res) => {
  try {
    const vendorData = req.body;

    // Create vendor
    const vendor = await Vendor.create(vendorData);

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this information already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private
exports.updateVendor = async (req, res) {
  try {
    const vendorId = req.params.id;
    const updateData = req.body;

    // Find and update vendor
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this information already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Find and delete vendor
    const vendor = await Vendor.findByIdAndDelete(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getVendors: exports.getVendors,
  getVendorById: exports.getVendorById,
  createVendor: exports.createVendor,
  updateVendor: exports.updateVendor,
  deleteVendor: exports.deleteVendor
};