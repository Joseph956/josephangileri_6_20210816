//app.js gère toutes les requêtes envoyées vers le serveur.
const express = require('express');
const session = require('express-session');

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

//créer et lancer une application express
const app = express();

//Sécurisation de l'API cors origin.
app.use(cors());

//Entête activé par défaut utilisé pour lancer une attaque
app.disable('x-powered-by');

app.use(xssclean());

//Securise les entêtes HTTP des applications express 
app.use(helmet());

//Parse le body des requêtes .json
//Inclut à partir de la version 4.17 express
app.use(express.json());

//logger requests/responses
app.use(morgan('dev'));

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

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

//stocke le jeton "JWT" dans la session.
app.use(session({
	name: "session user",
	secret: process.env.cookie_session,
	secure: true,
	httpOnly: true,
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
