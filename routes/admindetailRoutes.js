const express = require('express');
const { getAdminKeys, updateAdminKeys, updatePoojaDetails } = require('../controllers/admindetailsController');

const router = express.Router();

router.get('/:adminId/keys', getAdminKeys);


router.post('/:adminId/keys', updateAdminKeys);


router.put('/update-pooja-details/:adminId', updatePoojaDetails);


module.exports = router;
