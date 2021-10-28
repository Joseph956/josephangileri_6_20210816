//hasher le mdp
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//chiffrage de l'email
const cryptoJs = require('crypto-js');

//Importation "models"de la BDD User.js.
const User = require('../models/User');

const dotenv = require('dotenv');
dotenv.config();

exports.signup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				//Chiffrage de l'mail avant envoie dans mongodb
				email: cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString(),
				password: hash
			});
			user
				.save()
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	const userEmailreseach = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
	console.log(userEmailreseach);
	User.findOne({ email: userEmailreseach })
		.then(user => {
			if (!user) {
				return res.status(401).json({ error: 'Utilisateur inexistant !' });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then(valid => {
					//Si le mot de passe est incorrect.
					if (!valid) {
						return res.status(403).json({ error: 'Le mot de passe est incorrect !' });
					}
					//Si le mot de passe est correct.
					//Envoie dans la reponse du serveur l'user id accompagné de son token d'authentification
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id },
							process.env.RANDOM_TOKEN_SECRET, { expiresIn: '24h' })
					});
				})
				.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};
