const express = require('express');
const { createAstro, updateAstro, getAstro, getAllAstros, deleteAstro,submitRating,getSatisfiedCustomers  } = require('../controllers/astroController');
const multer = require('multer');
const upload = require('../config/multer');
const router = express.Router();
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

router.post('/', uploadMiddleware.single('astro_image'), createAstro);
router.put('/:astro_id', uploadMiddleware.single('astro_image'), updateAstro);
router.get('/satisfied-customers', getSatisfiedCustomers);
router.get('/:astro_id', getAstro);
router.get('/', getAllAstros);
router.delete('/:astro_id', deleteAstro);
router.post('/rate/:astro_id/:user_id', submitRating);




module.exports = router;
