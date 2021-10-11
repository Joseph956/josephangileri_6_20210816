const express = require('express');

//fonction router d'express.
const router = express.Router();

//Importation du "controllers"/user.js.
const userCtrl = require('../controllers/user');

//Importation 
const verifyEmail = require('../middlware/email');

//Importation
const verifyPasswd = require('../middlware/passwd');

//limite les requêtes abusives.
const rateLimit = require("express-rate-limit");

const blocageRequete = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, //Limite chaque IP a cinq requêtes par windowMs
    message: "Requetes abusives, vous devez attendre 5 min",
});

//les routes "endpoints" inscriptions nouvel utilisateur et login.
router.post('/signup', verifyEmail, verifyPasswd, userCtrl.signup);
router.post('/login', blocageRequete, userCtrl.login);

module.exports = router;
