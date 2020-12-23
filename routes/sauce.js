const express= require('express');
const router = express.Router();



const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateOneSauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteOneSauce);
router.post('/:id/like', auth, sauceCtrl.usersLikeSauce);
router.get('/', auth, sauceCtrl.getAllSauces);


module.exports = router;