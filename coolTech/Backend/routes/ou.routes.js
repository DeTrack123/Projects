const express = require('express');
const router = express.Router();
const ouController = require('../controllers/ou.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Get all organizational units (used in frontend dropdowns)
router.get('/', verifyToken, ouController.getAllOUs);

module.exports = router;
