const express = require('express');
const router = express.Router();
const { addToCart,updateQuantity, removeProduct,getCartDetails  } = require('../controllers/cartProductController');  

router.post('/add/:userId/:categoryId/:productId', addToCart);
router.post('/updatequantity/:userId/:categoryId/:productId', updateQuantity);
router.delete('/remove/:userId/:categoryId/:productId', removeProduct);
router.get('/details/:userId', getCartDetails);
module.exports = router;  