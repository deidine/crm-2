const express = require('express');
const router = express.Router();
const { catchErrors } = require('@/handlers/errorHandlers');

 const productCategoryController = require('@/controllers/appControllers/productCategoryController');
const productController = require('@/controllers/appControllers/productController');
 
// Product Category Routes
router.post('/category/create', catchErrors(productCategoryController.create));
router.get('/category/read/:id', catchErrors(productCategoryController.read));
router.patch('/category/update/:id', catchErrors(productCategoryController.update));
router.delete('/category/delete/:id', catchErrors(productCategoryController.remove));
router.get('/category/search', catchErrors(productCategoryController.search));
router.get('/category/list', catchErrors(productCategoryController.list));
router.get('/category/tree', catchErrors(productCategoryController.tree));

// Product Routes
router.post('/product/create', catchErrors(productController.create));
router.get('/product/read/:id', catchErrors(productController.read));
router.patch('/product/update/:id', catchErrors(productController.update));
router.delete('/product/delete/:id', catchErrors(productController.remove));
router.get('/product/search', catchErrors(productController.search));
router.get('/product/list', catchErrors(productController.list));
router.patch('/product/update-stock/:id', catchErrors(productController.updateStock));
router.get('/product/low-stock', catchErrors(productController.lowStock));

module.exports = router;
