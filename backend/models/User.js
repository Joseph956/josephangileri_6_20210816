//Création du model utilisateur avec mongoose
const mongoose = require('mongoose');

//Email unique, prévalide l'email avant enregistrement dans la BDD.
const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Permet de ne pas enregistrer deux fois le email dans la BDD mongodb.
userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);