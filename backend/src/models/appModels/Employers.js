const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  managerName: {
    type: String,
    required: true,
    trim: true,
  },
  managerSurname: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v) {
    //     return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
    //   },
    //   message: 'Invalid phone number format',
    // },
  },
  email: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v) {
    //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    //   },
    //   message: 'Invalid email format',
    // },
  },
});

module.exports = mongoose.model('Employers', EmployerSchema);
