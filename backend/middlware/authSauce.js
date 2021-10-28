const Thing = require('../models/Thing');
const jwt = require('jsonwebtoken'); //module npm token
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        const sauceId = req.params.id;
        Thing.findOne({ _id: sauceId })
            .then(thing => {
                if (userId === thing.userId) {
                    req.token = token;
                    req.user = userId;
                    next();
                } else {
                    res.status(401).json({
                        error: "Vous n'avez pas l'autorisation de modifier cette sauce!!! "
                    });
                }
            });
    } catch (error) {
        res.status(500).json({ error });
    }
};