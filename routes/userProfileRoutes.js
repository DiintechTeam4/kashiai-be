const express = require('express');
const router = express.Router();
const { getUsers,getUserbyId,getPoojaPaymentsByUser,getOrderHistoryByUser,getTotalUsers } = require('../controllers/userProfileController');
const { route } = require('./poojaRoutes');


router.get('/users', getUsers);

router.get('/user/:userid', getUserbyId);

router.get('/totalusers',getTotalUsers);

router.get("/pooja-payments", getPoojaPaymentsByUser);

router.get("/order-history", getOrderHistoryByUser);

module.exports = router;
