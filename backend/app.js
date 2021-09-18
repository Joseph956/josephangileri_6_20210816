//app.js gère toutes les requêtes envoyées vers le serveur.
const express = require('express');
const mongoose = require('./db/db');
// const bodyParser = require('body-parser');
const morgan = require('morgan'); //logger http
require('dotenv').config();

//Accèder au dossier images
const path = require('path');

//Charge les variables d'envirnnement
require('dotenv').config();

//variables de stockages des routes
const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//créer et lancer une application express
const app = express();

//Parse le body des requêtes .json
//Inclut à partir de la version 4.17 express
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());

//logger requests/responses
app.use(morgan('dev'));

//route general de la fonction middlware.
//Configuration des cors
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

//les routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

//exportation de app.js pour pouvoir y
//accèder à partir d'un autre fichier.
module.exports = app;
