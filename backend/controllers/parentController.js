const User = require('../models/User');
const ParentProfile = require('../models/ParentProfile');
const APIFeatures = require('../utils/apiFeatures');



const formatParentRecord = (pr) => {
  if (!pr) return null;
  const u = pr.userId || {};
  return {
    _id: pr._id || pr.id,
    id: pr._id || pr.id,
    userId: u._id || null,
    name: u.name || 'Parent Guardian',
    email: u.email || '',
    phone: pr.phone || u.phone || '',
    avatar: u.avatar || '',
    status: u.status || 'active',
    parentId: pr.parentId || '',
    relationship: pr.relationship || 'father',
    occupation: pr.occupation || '',
    income: pr.income || '',
    alternatePhone: pr.alternatePhone || '',
    address: pr.address || '',
    emergencyContact: pr.emergencyContact || '',
    children: pr.children || [],
  };
};

// @desc    Get currently logged in parent profile
// @route   GET /api/parents/me
// @access  Private (parent)
exports.getParentMe = async (req, res, next) => {
  try {
    const parent = await ParentProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email avatar phone status')
      .populate({
        path: 'children',
        populate: { path: 'userId', select: 'name email avatar phone status' },
      });

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: formatParentRecord(parent),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all parents with search, filter & pagination
// @route   GET /api/parents
// @access  Private (super_admin, teacher)
exports.getParents = async (req, res, next) => {
  try {
    const features = new APIFeatures(ParentProfile.find().populate('userId', 'name email avatar phone status').populate('children'), req.query)
      .search(['parentId', 'relationship', 'occupation'])
      .filter()
      .sort()
      .paginate();

    const parents = await features.query;
    const total = await ParentProfile.countDocuments();

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const formatted = parents.map(formatParentRecord);

    res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Parent
// @route   POST /api/parents
// @access  Private (super_admin)
exports.createParent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      occupation,
      address,
      relationship,
      emergencyContact,
      avatar,
      children,
      status,
    } = req.body;

    const user = await User.create({
      name,
      email: email || `parent_${Date.now()}@edumanage.com`,
      password: 'password123',
      role: 'parent',
      phone: phone || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      status: status || 'active',
    });

    const newParent = await ParentProfile.create({
      userId: user._id,
      parentId: `PAR-2026-${Math.floor(Math.random() * 900 + 100)}`,
      relationship: relationship || 'father',
      occupation: occupation || 'Business',
      address: address || '',
      phone: phone || '',
      emergencyContact: emergencyContact || '',
      children: children || [],
    });

    const result = await ParentProfile.findById(newParent._id)
      .populate('userId', 'name email avatar phone status')
      .populate('children');

    res.status(201).json({
      success: true,
      message: 'Parent registered successfully',
      data: formatParentRecord(result),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Parent
// @route   PUT /api/parents/:id
// @access  Private (super_admin)
exports.updateParent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let parent = null;

    if (id && id.length === 24) {
      parent = await ParentProfile.findById(id);
      if (!parent) {
        parent = await ParentProfile.findOne({ userId: id });
      }
    }

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent profile not found to update',
      });
    }

    // Role-based authorization check
    const userRole = req.user?.role || 'super_admin';
    const userId = req.user?._id;

    if (userRole === 'parent') {
      if (parent.userId?.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own profile.',
        });
      }
      // Parents cannot change status, parentId, or children links
      const forbidden = ['parentId', 'children', 'status'];
      forbidden.forEach(field => {
        if (req.body[field] !== undefined) {
          delete req.body[field];
        }
      });
    }

    // Update parent profile fields
    const profileFields = [
      'parentId', 'relationship', 'occupation', 'income',
      'alternatePhone', 'address', 'phone', 'emergencyContact', 'children'
    ];

    profileFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        parent[field] = req.body[field];
      }
    });

    await parent.save();

    // Update linked user fields
    if (parent.userId) {
      const userUpdates = {};
      if (req.body.name !== undefined) userUpdates.name = req.body.name;
      if (req.body.email !== undefined) userUpdates.email = req.body.email;
      if (req.body.phone !== undefined) userUpdates.phone = req.body.phone;
      if (req.body.avatar !== undefined) userUpdates.avatar = req.body.avatar;
      if (req.body.status !== undefined) userUpdates.status = req.body.status;

      if (Object.keys(userUpdates).length > 0) {
        await User.findByIdAndUpdate(parent.userId, userUpdates);
      }
    }

    const result = await ParentProfile.findById(parent._id)
      .populate('userId', 'name email avatar phone status')
      .populate('children');

    res.status(200).json({
      success: true,
      message: 'Parent details updated successfully',
      data: formatParentRecord(result),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Parent
// @route   DELETE /api/parents/:id
// @access  Private (super_admin)
exports.deleteParent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (id && id.length === 24) {
      const parent = await ParentProfile.findById(id);
      if (parent) {
        deleted = true;
        if (parent.userId) {
          await User.findByIdAndUpdate(parent.userId, { status: 'inactive' });
        }
        await ParentProfile.findByIdAndDelete(id);
      } else {
        const parentByUserId = await ParentProfile.findOne({ userId: id });
        if (parentByUserId) {
          deleted = true;
          await User.findByIdAndUpdate(id, { status: 'inactive' });
          await ParentProfile.findByIdAndDelete(parentByUserId._id);
        }
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Parent profile not found to delete',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Parent record removed successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Parent Profile
// @route   GET /api/parents/:id
// @access  Private
exports.getParentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let parent = null;

    if (id && id.length === 24) {
      parent = await ParentProfile.findById(id)
        .populate('userId', 'name email avatar phone status')
        .populate({
          path: 'children',
          populate: { path: 'userId', select: 'name email avatar phone status' }
        });
      if (!parent) {
        parent = await ParentProfile.findOne({ userId: id })
          .populate('userId', 'name email avatar phone status')
          .populate({
            path: 'children',
            populate: { path: 'userId', select: 'name email avatar phone status' }
          });
      }
    }

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent profile not found',
      });
    }

    // Role checks
    const userRole = req.user?.role;
    const userId = req.user?._id;

    if (userRole === 'parent') {
      if (parent.userId?._id?.toString() !== userId?.toString() && parent.userId?.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own profile.',
        });
      }
    } else if (userRole === 'student') {
      const StudentProfile = require('../models/StudentProfile');
      const student = await StudentProfile.findOne({ userId });
      if (!student || !parent.children.some(child => child._id.toString() === student._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: formatParentRecord(parent),
    });
  } catch (error) {
    next(error);
  }
};
