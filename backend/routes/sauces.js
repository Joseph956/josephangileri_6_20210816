const express = require('express');
const router = express.Router();

const auth = require('../middlware/auth');
const multer = require('../middlware/multer-config');

const apiCtrl = require('../controllers/sauces');

router.get('/', auth, apiCtrl.getAllThings);
router.get('/:id', auth, apiCtrl.getOneThing);
router.post('/', auth, multer, apiCtrl.createThing);
router.put('/:id', auth, multer, apiCtrl.modifyThing);
router.delete('/:id', auth, apiCtrl.deleteThing);

module.exports = router;
