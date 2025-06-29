const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('@/models/coreModels/Admin');

const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email });
  if (!admin) throw new Error('Admin not found!');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Password incorrect!');

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log('Successfully logged in',admin.username)
  res.status(200).json({
    success: true,
    result: {
      token,
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        country: admin.country
      }
    },
    message: 'Successfully logged in',
  });
};

const register = async (req, res) => {
  const { username, email, password, country } = req.body;

  const existingAdmin = await Admin.findOne({ email: email });
  if (existingAdmin) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Admin.create({
    username,
    email,
    password: hashedPassword,
    country,
    role: 'admin'
  });

  const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({
    success: true,
    result: {
      token,
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        country: newAdmin.country
      }
    },
    message: 'Successfully registered',
  });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email: email });
  if (!admin) throw new Error('Admin not found!');

  // Add your password reset logic here
  res.status(200).json({
    success: true,
    message: 'Password reset instructions sent to email',
  });
};

const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  // Add your password reset verification logic here
  res.status(200).json({
    success: true,
    message: 'Password successfully reset',
  });
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
};

const isValidAuthToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('No auth token');
    
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findOne({ _id: decoded.id });
    if (!admin) throw new Error('Admin not found');
    
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      result: null,
      message: 'Invalid authentication token',
    });
  }
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout,
  isValidAuthToken,
};
