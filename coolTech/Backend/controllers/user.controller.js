const User = require('../models/user.model');
const Division = require('../models/division.model');
const OrganizationalUnit = require('../models/organizationalUnit.model');

// ----------Get all users---------
// Get all active users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ active: true })
      .select('-password')
      .populate('division')
      .populate('organizationalUnit');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// ----------Get user by ID---------
// Get a single user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('division')
      .populate('organizationalUnit');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// ----------Assign user to division---------
// Assign user to division (automatically assigns parent OU)
exports.assignToDivision = async (req, res) => {
  try {
    const { userId, divisionId } = req.body;

    if (!userId || !divisionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Division ID are required'
      });
    }

    // Get division with its parent OU
    const division = await Division.findById(divisionId).populate('organizationalUnit');
    if (!division) {
      return res.status(404).json({
        success: false,
        message: 'Division not found'
      });
    }

    // Assign both division and its OU to user
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        division: divisionId,
        organizationalUnit: division.organizationalUnit._id
      },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('division')
      .populate('organizationalUnit');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User assigned to division successfully',
      data: user
    });
  } catch (error) {
    console.error('Error assigning user to division:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error assigning user to division',
      error: error.message
    });
  }
};

// ----------Deassign user from division---------
// Remove user from division and OU (admin only)
exports.deassignFromDivision = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Clear both division and OU assignments
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        division: null,
        organizationalUnit: null
      },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('division')
      .populate('organizationalUnit');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deassigned from division successfully',
      data: user
    });
  } catch (error) {
    console.error('Error deassigning user from division:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deassigning user from division',
      error: error.message
    });
  }
};

// ----------Change user role---------
// Change user role (normal, management, or admin)
exports.changeUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'User ID and role are required'
      });
    }

    // Validate role is one of the allowed values
    const validRoles = ['normal', 'management', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('division')
      .populate('organizationalUnit');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role changed to ${role} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error changing user role:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error changing user role',
      error: error.message
    });
  }
};

// ----------Update user profile---------
// Update user profile (email/password - users can update own, admin can update any)
exports.updateUserProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Verify user can only update their own profile (unless admin)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Update password if provided
    if (newPassword) {
      // Admin can change password without current password
      if (req.user.role !== 'admin') {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is required to change password'
          });
        }

        // Verify current password is correct
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
      }

      user.password = newPassword;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('division')
      .populate('organizationalUnit');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

// ----------Deactivate user---------
// Deactivate user account (admin only - soft delete)
exports.deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deactivating themselves
    if (userId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    // Set active to false instead of deleting
    const user = await User.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error deactivating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user',
      error: error.message
    });
  }
};
