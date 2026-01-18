const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

//---------Register new user---------
// Register a new user with default 'normal' role
exports.register = async function(req, res) {
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: req.body.email }, { username: req.body.username }]
    });

    if (existingUser) {
      return res.status(400).send({message: "User already exists"});
    }

    // Create new user with normal role (password will be hashed automatically)
    let userModel = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: 'normal'
    });   
    
    const data = await userModel.save();
    
    // Return user data without password
    const userResponse = {
      id: data._id,
      username: data.username,
      email: data.email,
      role: data.role
    };
    
    res.send(userResponse);
  } catch(err) {
    console.error('Registration error:', err.message);
    res.status(500).send({message: "Some error occurred while creating the user.", error: err.message});
  }
};

//---------Login user---------
// Login user and return JWT token
exports.login = async function(req, res) {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).send({message: "Invalid username or password"});
    }

    // Verify password using bcrypt comparison
    const isPasswordValid = await user.comparePassword(req.body.password);

    if (!isPasswordValid) {
      return res.status(401).send({message: "Invalid username or password"});
    }

    // Create JWT token with user info (expires in 24 hours)
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Send token and user data
    res.send({
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch(err) {
    console.error('Login error:', err.message);
    res.status(500).send({message: "Some error occurred while logging in"});
  }
};
