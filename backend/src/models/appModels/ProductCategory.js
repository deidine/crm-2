const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
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
    unique: true,
  },
  description: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null,
  },
  slug: {
    type: String,
    unique: true,
  },
  photo: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from name before saving
productCategorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  this.updated = new Date();
  next();
});

// Add virtual for subcategories
productCategorySchema.virtual('subcategories', {
  ref: 'ProductCategory',
  localField: '_id',
  foreignField: 'parent',
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);
