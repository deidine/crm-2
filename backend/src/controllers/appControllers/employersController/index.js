const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function modelController() {
  const Model = mongoose.model('Employers');
  const methods = createCRUDController('Employers');
  methods.summary = (req, res) => summary(Model, req, res);
  return methods;
}

module.exports = modelController();
