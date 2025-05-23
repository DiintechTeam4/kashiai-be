const express = require('express');
const router = express.Router();
const darshanController = require('../controllers/darshanController');
const upload = require('../middlewares/uploadMiddleware');
const multer = require('multer');
const path = require('path'); 
const fs = require('fs');
const { route } = require('./poojaRoutes');

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
router.post('/',uploadMiddleware.single('darshan_image'), darshanController.createDarshan);
router.get('/totaldarshans',darshanController.getTotalDarshans)
router.put('/:darshan_id',uploadMiddleware.single('file'), darshanController.updateDarshan);
router.get('/:darshan_id', darshanController.getDarshan);
router.get('/', darshanController.getAllDarshans);
router.delete('/:darshan_id', darshanController.deleteDarshan);

module.exports = router;