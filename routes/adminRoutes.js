const express = require('express');
const router = express.Router();
const { blockUser, checkBlockedUser,unblockUser } = require('../controllers/adminController');


router.post('/admin/block/:adminId', blockUser);

router.get('/check-blocked/:userId', checkBlockedUser);


router.delete('/admin/unblock/:userId', unblockUser);



module.exports = router;
