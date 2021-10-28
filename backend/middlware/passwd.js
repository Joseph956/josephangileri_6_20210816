const passwrdValidator = require('password-validator');

//Création du schéma mot de passe fort.
const passwdSchema = new passwrdValidator();

//ajout des propriétés du mot de passe
passwdSchema
    .is().min(8)                                    // Minimum length 8 (8 caractères)
    .is().max(100)                                   // Maximum length 50 (50 caractères)
    .has().uppercase()                              // Must have uppercase letters (1 majuscule)
    .has().lowercase()                              // Must have lowercase letters (1 minuscule)
    .has().digits(2)                                 // Must have at least 2 digits (au (-) 2 chiffres)
    .has().symbols(1)                                // Must have at least 1 digits (au (-) 1 symbole)
    .has().not().spaces()                           // Should not have spaces (pas d'espace)
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values 

module.exports = (req, res, next) => {
    if (passwdSchema.validate(req.body.password)) {
        next();

    } else {
        return res.status(400).json({
            error: "Le mot de passe n'est pas assez fort :" +
                passwdSchema.validate(req.body.password, { list: true })

        })
    }
};