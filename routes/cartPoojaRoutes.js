const express = require('express');
const router = express.Router();
const { addPoojaToCart,addAddonToCart, removeAddonFromCart,getCartDetails } = require('../controllers/cartPoojaController');  

router.post('/add-pooja/:user_id/:pooja_id', addPoojaToCart);

router.post('/add-addon/:user_id/:pooja_id', addAddonToCart);

router.delete('/remove-addon/:user_id/:pooja_id', removeAddonFromCart);

router.get('/get-cart/:user_id', getCartDetails);

module.exports = router;  