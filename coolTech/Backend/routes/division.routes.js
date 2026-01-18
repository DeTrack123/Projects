const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/division.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Get all divisions (used in frontend dropdowns)
router.get('/', verifyToken, divisionController.getAllDivisions);

// Get divisions by organizational unit (used in frontend filtering)
router.get('/ou/:ouId', verifyToken, divisionController.getDivisionsByOU);

module.exports = router;
