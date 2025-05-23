const express = require('express');
const router = express.Router();
const poojaController = require('../controllers/poojaController');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', upload.fields([
    { name: 'images', maxCount: 10 },  
    { name: 'addonImages', maxCount: 20 } 
]), poojaController.createPooja);


router.put('/:pooja_id',
    upload.fields([
        { name: 'images', maxCount: 10 }
    ])
     ,poojaController.updatePooja);

router.delete('/:pooja_id', poojaController.deletePooja);


router.get('/', poojaController.getAllPoojaDetails);

router.get('/totalpooja',poojaController.getTotalPoojas)

router.get('/:pooja_id', poojaController.getPoojaById);



module.exports = router;
