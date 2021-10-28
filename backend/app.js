//app.js gère toutes les requêtes envoyées par le serveur.
const express = require('express');

//Stocke les données de session sur le serveur n'est pas conçu pour un environnement de production.
//En production 
const session = require('express-session');
const fs = require('fs');

//Charge les variables d'environnement
const dotenv = require('dotenv');
dotenv.config();

// const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('./db/db');

//Accèder au dossier images
const path = require('path');

//debugger mongoose
mongoose.set('debug', true);

const morgan = require('morgan'); //logs http
const xssclean = require('xss-clean');
const noCache = require('nocache');

//Sécurise les communications applicatives monopage interdomaines.
const cors = require('cors');

//Importation des routes "variables de stockages des routes".
const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//créer et lancer une application express
const app = express();

//Sécurisation de l'API cors origin.
app.use(cors());

//Entête activé par défaut utilisé pour lancer une attaque.
//Permet de détecter les applications qui excutent express.
app.disable('x-powered-by');

app.use(xssclean());

//Securise les entêtes HTTP des applications express 
app.use(helmet());

//Parse le body des requêtes .json
//Inclut à partir de la version 4.17 express
//Utilisation de json pour récupération de paramétres.
app.use(express.json());
//Pour encoder le contenu.
app.use(express.urlencoded({ extended: true }));

//logger requests/responses
app.use(morgan('dev'));

app.use(morgan('combined', { stream: accessLogStream }));

//route general de la fonction middlware.
//Configuration des cors
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// stocke le jeton "JWT" dans la session.
app.use(session({
	name: "sessionId",
	secret: process.env.COOKIE_SESSION,
	secure: true, //garantie que le navigateur envoie le cookie sur https uniquement.
	httpOnly: true, //Evite les attaques Cross-site-scripting.
	cookie: { maxAge: 600000 }//jeton stocké pendant 10 min
}));

//Désactive le cache
app.use(noCache());

//les routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

//exportation de app.js pour pouvoir y
//accèder à partir d'un autre fichier.
module.exports = app;
