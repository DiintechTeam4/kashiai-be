const express = require('express');
const router = express.Router();
const { updateProfile,requestDeleteAccount  } = require('../controllers/useraccountController'); 


router.put('/update-profile/:userId', updateProfile);
router.post('/delete-request', requestDeleteAccount);
module.exports = router;
