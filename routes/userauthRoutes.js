const express = require('express');
const router = express.Router();
const { googleAuth,checkOrInsertUser } = require('../controllers/userauthController');

router.post('/google-login', googleAuth);
router.post('/mobile-login', checkOrInsertUser);
module.exports = router;
