const express = require('express');
const router = express.Router();
const { bookPandit,getPanditBookingHistory,createPandit,getPandit,getPanditbyId, deletePandit, updatePandit, getPanditBooking , assignpandit} = require('../controllers/panditController')
const multer = require('multer');
const upload = require('../config/multer');
const path = require('path'); 
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const uploadMiddleware = multer({ storage });

router.post('/create',uploadMiddleware.single('profilePhoto'), createPandit );

router.get('/', getPandit );

// router.get('/:pandit_id', getPanditbyId );

router.delete('/:pandit_id',deletePandit)

router.put('/:pandit_id',uploadMiddleware.single('profilePhoto'),updatePandit)

router.post('/book-pandit/:userId', bookPandit);  

router.get('/pandit-booking', getPanditBooking);

router.put("/:id/assign",assignpandit);

router.get('/pandit-booking-history/:userId', getPanditBookingHistory);

module.exports = router;
