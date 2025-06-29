const ProductCategory = require('@/models/appModels/ProductCategory');
const mongoose = require('mongoose');
const { matchSorter } = require('match-sorter');

const create = async (req, res) => {
  const { name } = req.body;
  
  // Check if category with same name exists
  const exists = await ProductCategory.findOne({ name, removed: false });
  if (exists) {
    throw new Error('Category with this name already exists');
  }
  
  const category = new ProductCategory(req.body);
  await category.save();
  
  return res.status(200).json({
    success: true,
    result: category,
    message: 'Category created successfully',
  });
};

const read = async (req, res) => {
  const { id } = req.params;
  
  const category = await ProductCategory.findOne({ _id: id, removed: false })
    .populate('parent')
    .populate('subcategories');
  
  if (!category) throw new Error('Category not found');
  
  return res.status(200).json({
    success: true,
    result: category,
    message: 'Category retrieved successfully',
  });
};

const update = async (req, res) => {
  const { id } = req.params;
  
  // Prevent circular parent reference
  if (req.body.parent === id) {
    throw new Error('Category cannot be its own parent');
  }
  
  const category = await ProductCategory.findOneAndUpdate(
    { _id: id, removed: false },
    req.body,
    { new: true }
  )
    .populate('parent')
    .populate('subcategories');
  
  if (!category) throw new Error('Category not found');
  
  return res.status(200).json({
    success: true,
    result: category,
    message: 'Category updated successfully',
  });
};

const remove = async (req, res) => {
  const { id } = req.params;
  
  // Check for subcategories
  const hasSubcategories = await ProductCategory.exists({ parent: id, removed: false });
  if (hasSubcategories) {
    throw new Error('Cannot delete category with subcategories');
  }
  
  const category = await ProductCategory.findOneAndUpdate(
    { _id: id, removed: false },
    { removed: true },
    { new: true }
  );
  
  if (!category) throw new Error('Category not found');
  
  return res.status(200).json({
    success: true,
    result: category,
    message: 'Category deleted successfully',
  });
};

const search = async (req, res) => {
  const { query } = req.query;

  let results = await ProductCategory.find({ removed: false })
    .populate('parent')
    .populate('subcategories');

  if (query) {
    results = matchSorter(results, query, {
      keys: ['name', 'description']
    });
  }

  return res.status(200).json({
    success: true,
    result: results,
    message: 'Categories retrieved successfully',
  });
};

const list = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const categories = await ProductCategory.find({ removed: false })
    .populate('parent')
    .populate('subcategories')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ created: -1 });

  const total = await ProductCategory.countDocuments({ removed: false });

  return res.status(200).json({
    success: true,
    result: categories,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    message: 'Categories retrieved successfully',
  });
};

// Get category tree (hierarchical structure)
const tree = async (req, res) => {
  const categories = await ProductCategory.find({ removed: false, parent: null })
    .populate({
      path: 'subcategories',
      match: { removed: false },
      populate: {
        path: 'subcategories',
        match: { removed: false }
      }
    });

  return res.status(200).json({
    success: true,
    result: categories,
    message: 'Category tree retrieved successfully',
  });
};

module.exports = {
  create,
  read,
  update,
  remove,
  search,
  list,
  tree
};
