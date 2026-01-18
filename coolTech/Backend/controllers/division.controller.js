const Division = require('../models/division.model');
const OrganizationalUnit = require('../models/organizationalUnit.model');

// ----------New division---------
// Create a new division
exports.createDivision = async (req, res) => {
  try {
    console.log('Creating Division with data:', req.body);

    const { name, organizationalUnit, description } = req.body;

    // Check if OU exists
    const ou = await OrganizationalUnit.findById(organizationalUnit);
    if (!ou) {
      return res.status(404).json({
        success: false,
        message: 'Organizational unit not found'
      });
    }

    // Check if division already exists in this OU
    const existingDivision = await Division.findOne({ name, organizationalUnit });
    if (existingDivision) {
      return res.status(400).json({
        success: false,
        message: 'Division with this name already exists in this organizational unit'
      });
    }

    // Create new division
    const division = await Division.create({
      name,
      organizationalUnit,
      description
    });

    // Populate OU details
    await division.populate('organizationalUnit');

    console.log('Division created successfully:', division);

    res.status(201).json({
      success: true,
      message: 'Division created successfully',
      data: division
    });
  } catch (error) {
    console.error('Error creating division:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating division',
      error: error.message
    });
  }
};

// ----------Get divisions---------
// Get all divisions
exports.getAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.find({ active: true })
      .populate('organizationalUnit');

    res.status(200).json({
      success: true,
      count: divisions.length,
      data: divisions
    });
  } catch (error) {
    console.error('Error fetching divisions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching divisions',
      error: error.message
    });
  }
};

// ----------Get divisions by OU---------
// Get divisions by organizational unit
exports.getDivisionsByOU = async (req, res) => {
  try {
    const divisions = await Division.find({ 
      organizationalUnit: req.params.ouId,
      active: true 
    }).populate('organizationalUnit');

    res.status(200).json({
      success: true,
      count: divisions.length,
      data: divisions
    });
  } catch (error) {
    console.error('Error fetching divisions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching divisions',
      error: error.message
    });
  }
};
