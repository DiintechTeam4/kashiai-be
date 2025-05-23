const express = require('express');
const { 
  createCategory, 
  getAllCategories, 
  createProduct, 
  getProductsByCategory, 
  getAllProducts, 
  updateProduct, 
  deleteProduct, 
  deleteCategory,
  updateCategory
} = require('../controllers/categoryProductController');
const upload = require('../middlewares/uploadMiddleware');  

const router = express.Router();

router.post('/categories', upload.single('image'), createCategory);  
router.get('/categories', getAllCategories);  
router.put('/categories/:category_id',upload.single('image'),  updateCategory); 


router.post('/categories/:category_id/products', upload.array('images', 5), createProduct); 


router.get('/categories/:category_id/products', getProductsByCategory);  

router.get('/products', getAllProducts);  

router.put('/categories/:category_id/products/:product_id', updateProduct);  
router.delete('/categories/:category_id/products/:product_id', deleteProduct); 
router.delete('/categories/:category_id',  deleteCategory);  





module.exports = router;
