const Employer = require('../models/Employer');

// Create a new employer
exports.createEmployer = async (req, res) => {
  try {
    const employer = new Employer(req.body);
    await employer.save();
    res.status(201).json(employer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all employers
exports.getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find();
    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single employer by ID
exports.getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an employer by ID
exports.updateEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an employer by ID
exports.deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
