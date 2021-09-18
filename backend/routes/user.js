const express = require('express');
const jwt = require('jsonwebtoken');
// const verifyAuth = require('../middlware/auth');
const router = express.Router();

const userCtrl = require('../controllers/user');
// const auth = require('../middlware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// router.get('/', userCtrl.getAllUsers);

module.exports = router;
