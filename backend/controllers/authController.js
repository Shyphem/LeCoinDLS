// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { User } = require('../models');
require('dotenv').config();

const login = async (req, res) => {
    const { mail, password } = req.body;

    try {
        const user = await User.findOne({ where: { mail } });

        if (!user) {
            return res.status(404).json({ message: 'Email ou Mot de passe incorrect !' });
        }

        if (user.statut === 'supprimé') {
            return res.status(404).json({ message: "Votre compte a été supprimé veuillez contacter lecoindls@lyceedelasalle.fr" });
        }

        if (user.statut === 'suspendu') {
            return res.status(404).json({ message: "Votre compte a été suspendu. Si vous voulez contester cette sanction veuillez contacter lecoindls@lyceedelasalle.fr" });
        }

        // Hacher le mot de passe fourni en MD5
        const md5Password = md5(password);

        // Comparer le mot de passe MD5 haché avec bcrypt
        const isPasswordValid = await bcrypt.compare(md5Password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou Mot de passe incorrect !' });
        }

        // Mettre à jour la date d'inscription si elle est null
        if (!user.inscription_date) {
            user.inscription_date = new Date();
        }

        // Mettre à jour la dernière connexion
        user.last_connexion = new Date();

        await user.save();

        // Générer un token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Le token expire dans 1 heure
        });

        // Envoyer le token dans un cookie
        res.cookie('authToken', token, { httpOnly: false, secure: true, sameSite: 'None', domain: '.lecoindls.site', maxAge: 3600000 }); // 1 heure

        res.status(200).json({ message: 'Connexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { login };