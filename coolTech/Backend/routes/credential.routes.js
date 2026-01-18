const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credential.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Create a new credential (authenticated users)
router.post('/', verifyToken, credentialController.createCredential);

// Get all credentials (filtered by user's access)
router.get('/', verifyToken, credentialController.getAllCredentials);

// Get credentials by division
router.get('/division/:divisionId', verifyToken, credentialController.getCredentialsByDivision);

// Get a single credential by ID
router.get('/:id', verifyToken, credentialController.getCredentialById);

// Update a credential (management and admin only - checked in controller)
router.put('/:id', verifyToken, credentialController.updateCredential);

// Delete (deactivate) a credential (admin only - checked in controller)
router.delete('/:id', verifyToken, credentialController.deleteCredential);

module.exports = router;
