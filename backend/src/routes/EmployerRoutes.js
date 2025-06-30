const express = require('express');
const router = express.Router();
const {
  createEmployer,
  getEmployers,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
} = require('../controllers/EmployerController');

// Create a new employer
router.post('/', createEmployer);

// Get all employers
router.get('/', getEmployers);

// Get a single employer by ID
router.get('/:id', getEmployerById);

// Update an employer by ID
router.put('/:id', updateEmployer);

// Delete an employer by ID
router.delete('/:id', deleteEmployer);

module.exports = router;
