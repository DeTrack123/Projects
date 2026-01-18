const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', verifyToken, isAdmin, userController.getUserById);

// Assign user to division (admin only)
router.post('/assign-division', verifyToken, isAdmin, userController.assignToDivision);

// Deassign user from division (admin only)
router.post('/deassign-division', verifyToken, isAdmin, userController.deassignFromDivision);

// Change user role (admin only)
router.post('/change-role', verifyToken, isAdmin, userController.changeUserRole);

// Update user profile (user can update own, admin can update any)
router.put('/:id', verifyToken, userController.updateUserProfile);

// Deactivate user (admin only - soft delete)
router.delete('/:id', verifyToken, isAdmin, userController.deactivateUser);

module.exports = router;
