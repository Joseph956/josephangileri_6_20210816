const express = require('express');
const router = express.Router();
const auth = require('../middlware/auth');
const authSauce = require('../middlware/authSauce');
const multer = require('../middlware/multer-config');
const apiCtrl = require('../controllers/sauces');

router.get('/', auth, apiCtrl.getAllThings);
router.get('/:id', auth, apiCtrl.getOneThing);
router.post('/', auth, multer, apiCtrl.createThing);
router.put('/:id', auth, authSauce, multer, apiCtrl.modifyThing);
router.delete('/:id', auth, authSauce, multer, apiCtrl.deleteThing);
router.post('/:id/like', auth, apiCtrl.likeSauce);

module.exports = router;
