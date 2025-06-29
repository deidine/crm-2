const Product = require('@/models/appModels/Product');
const mongoose = require('mongoose');
const { matchSorter } = require('match-sorter');

const create = async (req, res) => {
  const { sku } = req.body;
  
  // Check if product with same SKU exists
  const exists = await Product.findOne({ sku, removed: false });
  if (exists) {
    throw new Error('Product with this SKU already exists');
  }
  
  const product = new Product(req.body);
  await product.save();
  
  return res.status(200).json({
    success: true,
    result: product,
    message: 'Product created successfully',
  });
};

const read = async (req, res) => {
  const { id } = req.params;
  
  const product = await Product.findOne({ _id: id, removed: false })
    .populate('category')
    .populate('supplier', 'name email phone');
  
  if (!product) throw new Error('Product not found');
  
  return res.status(200).json({
    success: true,
    result: product,
    message: 'Product retrieved successfully',
  });
};

const update = async (req, res) => {
  const { id } = req.params;
  
  const product = await Product.findOneAndUpdate(
    { _id: id, removed: false },
    req.body,
    { new: true }
  )
    .populate('category')
    .populate('supplier', 'name email phone');
  
  if (!product) throw new Error('Product not found');
  
  return res.status(200).json({
    success: true,
    result: product,
    message: 'Product updated successfully',
  });
};

const remove = async (req, res) => {
  const { id } = req.params;
  
  const product = await Product.findOneAndUpdate(
    { _id: id, removed: false },
    { removed: true },
    { new: true }
  );
  
  if (!product) throw new Error('Product not found');
  
  return res.status(200).json({
    success: true,
    result: product,
    message: 'Product deleted successfully',
  });
};

const search = async (req, res) => {
  const { query } = req.query;
  const { status, category } = req.query;

  let filter = { removed: false };
  
  if (category) {
    filter.category = category;
  }
  
  if (status) {
    filter.status = status;
  }

  let results = await Product.find(filter)
    .populate('category')
    .populate('supplier', 'name email phone');

  if (query) {
    results = matchSorter(results, query, {
      keys: ['name', 'description', 'sku', 'barcode']
    });
  }

  return res.status(200).json({
    success: true,
    result: results,
    message: 'Products retrieved successfully',
  });
};

const list = async (req, res) => {
  console.log(req)
  const { page = 1, limit = 10 } = req.query;
  const { category, status } = req.query;

  let filter = { removed: false };
  
  if (category) {
    filter.category = category;
  }
  
  if (status) {
    filter.status = status;
  }

  const products = await Product.find(filter)
    .populate('category')
    // .populate('supplier', 'name email phone')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ created: -1 });

  const total = await Product.countDocuments(filter);
console.log(products,"deidine")
  return res.status(200).json({
    success: true,
    result: products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    message: 'Products retrieved successfully',
  });
};

// Update stock quantity
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, type = 'add' } = req.body;
  
  const product = await Product.findOne({ _id: id, removed: false });
  if (!product) throw new Error('Product not found');
  
  await product.updateStock(quantity, type);
  
  return res.status(200).json({
    success: true,
    result: product,
    message: 'Stock updated successfully',
  });
};

// Get low stock products
const lowStock = async (req, res) => {
  const products = await Product.find({
    removed: false,
    quantity: { $lte: mongoose.expr({ $ifNull: ['$minQuantity', 0] }) }
  })
    .populate('category')
    .populate('supplier', 'name email phone');

  return res.status(200).json({
    success: true,
    result: products,
    message: 'Low stock products retrieved successfully',
  });
};

module.exports = {
  create,
  read,
  update,
  remove,
  search,
  list,
  updateStock,
  lowStock
};
