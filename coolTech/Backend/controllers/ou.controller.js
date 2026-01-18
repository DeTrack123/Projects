const OrganizationalUnit = require('../models/organizationalUnit.model');

// Get all organizational units (used in frontend dropdowns)
exports.getAllOUs = async (req, res) => {
  try {
    const ous = await OrganizationalUnit.find({ active: true });

    res.status(200).json({
      success: true,
      count: ous.length,
      data: ous
    });
  } catch (error) {
    console.error('Error fetching OUs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching organizational units',
      error: error.message
    });
  }
};
