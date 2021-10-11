const emailSchema = require('validator');

module.exports = (req, res, next) => {
    if (emailSchema.isEmail(req.body.email)) {
        next();
    } else {
        return res.status(400).json({
            error: "Veuillez saisir un email valide !"
        });
    }
};