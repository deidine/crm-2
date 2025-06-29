const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },
  barcode: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  minQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  photo: {
    type: String,
  },
  status: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'low_stock', 'discontinued'],
    default: 'in_stock',
  },
  location: {
    type: String,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  tags: [{
    type: String,
  }],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Update status based on quantity
productSchema.pre('save', function(next) {
  this.updated = new Date();
  
  if (this.quantity <= 0) {
    this.status = 'out_of_stock';
  } else if (this.quantity <= this.minQuantity) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  
  next();
});

// Method to update quantity
productSchema.methods.updateStock = async function(quantity, type = 'add') {
  if (type === 'add') {
    this.quantity += quantity;
  } else if (type === 'remove') {
    this.quantity = Math.max(0, this.quantity - quantity);
  }
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
