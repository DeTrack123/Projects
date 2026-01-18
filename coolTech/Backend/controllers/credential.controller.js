const Credential = require('../models/credential.model');
const Division = require('../models/division.model');

//---------Create a credential---------
// Create a new credential (all authenticated users can add)
exports.createCredential = async (req, res) => {
  try {
    const { serviceName, username, password, url, description, division } = req.body;

    // Verify division exists before creating credential
    const divisionExists = await Division.findById(division);
    if (!divisionExists) {
      return res.status(404).json({
        success: false,
        message: 'Division not found'
      });
    }

    // Create credential with user ID from JWT token
    const credential = await Credential.create({
      serviceName,
      username,
      password,
      url,
      description,
      division,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    // Load related division and OU data
    await credential.populate({
      path: 'division',
      populate: { path: 'organizationalUnit' }
    });
    await credential.populate('createdBy', 'username email');
    await credential.populate('updatedBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Credential created successfully',
      data: credential
    });
  } catch (error) {
    console.error('Error creating credential:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating credential',
      error: error.message
    });
  }
};

// ---------Get credentials---------
// Get all credentials (admins see all, others see only their division)
exports.getAllCredentials = async (req, res) => {
  try {
    let filter = { active: true };

    // Non-admin users can only see credentials from their division
    if (req.user.role !== 'admin') {
      filter.division = req.user.division;
    }

    const credentials = await Credential.find(filter)
      .populate({
        path: 'division',
        populate: { path: 'organizationalUnit' }
      })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      count: credentials.length,
      data: credentials
    });
  } catch (error) {
    console.error('Error fetching credentials:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching credentials',
      error: error.message
    });
  }
};

// -----------Get credentials by division---------
// Get credentials for a specific division
exports.getCredentialsByDivision = async (req, res) => {
  try {
    const credentials = await Credential.find({ 
      division: req.params.divisionId,
      active: true 
    })
      .populate({
        path: 'division',
        populate: { path: 'organizationalUnit' }
      })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.status(200).json({
      success: true,
      count: credentials.length,
      data: credentials
    });
  } catch (error) {
    console.error('Error fetching credentials:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching credentials',
      error: error.message
    });
  }
};

// -----------Get single credential---------
// Get a single credential by ID
exports.getCredentialById = async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)
      .populate({
        path: 'division',
        populate: { path: 'organizationalUnit' }
      })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Verify user has access (admin or same division)
    if (req.user.role !== 'admin' && 
        credential.division._id.toString() !== req.user.division.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error('Error fetching credential:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching credential',
      error: error.message
    });
  }
};

// -----------Update a credential---------
// Update a credential (management and admin only)
exports.updateCredential = async (req, res) => {
  try {
    // Block normal users from updating
    if (req.user.role === 'normal') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update credentials'
      });
    }

    const { serviceName, username, password, url, description, division } = req.body;

    // Verify new division exists if being changed
    if (division) {
      const divisionExists = await Division.findById(division);
      if (!divisionExists) {
        return res.status(404).json({
          success: false,
          message: 'Division not found'
        });
      }
    }

    // Update credential and track who updated it
    const credential = await Credential.findByIdAndUpdate(
      req.params.id,
      { 
        serviceName, 
        username, 
        password, 
        url, 
        description, 
        division,
        updatedBy: req.user.id
      },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'division',
        populate: { path: 'organizationalUnit' }
      })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credential updated successfully',
      data: credential
    });
  } catch (error) {
    console.error('Error updating credential:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating credential',
      error: error.message
    });
  }
};

// -----------Delete a credential---------
// Deactivate a credential (admin only - soft delete)
exports.deleteCredential = async (req, res) => {
  try {
    // Only admins can delete credentials
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete credentials'
      });
    }

    // Set active to false instead of actually deleting
    const credential = await Credential.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
      .populate({
        path: 'division',
        populate: { path: 'organizationalUnit' }
      })
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credential deactivated successfully',
      data: credential
    });
  } catch (error) {
    console.error('Error deleting credential:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting credential',
      error: error.message
    });
  }
};
