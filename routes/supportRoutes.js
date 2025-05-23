const express = require('express');
const router = express.Router();
const { submitComplaint, getAllComplaints,resolveComplaint } = require('../controllers/supportController');


router.post('/user/submit/:userId', submitComplaint);


router.get('/complaints', getAllComplaints);


router.patch('/resolve/:complaintId', resolveComplaint);

module.exports = router;
