// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (token == null) {
        return res.sendStatus(401); // Si aucun token n'est fourni
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Si le token est invalide
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;