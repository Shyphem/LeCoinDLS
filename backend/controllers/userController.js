// controllers/userController.js
const { User, Annonce } = require('../models');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();
const chalk = require('chalk');

const getUserProfile = async (req, res) => {

    const { id } = req.user;

    try {
        const userProfile = await User.findByPk(id, {
            include: [{ model: Annonce }],
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Formater la date de la dernière connexion avec Moment.js
        const formattedLastConnexion = moment(userProfile.last_connexion).format('DD/MM/YYYY HH:mm:ss');
        // Formater la date d'inscription avec Moment.js
        const formattedInscriptionDate = moment(userProfile.inscription_date).format('DD/MM/YYYY HH:mm:ss');

        res.status(200).json({
            ...userProfile.toJSON(),
            last_connexion: formattedLastConnexion,
            inscription_date: formattedInscriptionDate
        });
    } catch (error) {
        console.error(chalk.red('Erreur lors de la récupération du profil de l\'utilisateur:', error));
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getUserInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            include: [{ model: Annonce }],
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Formater la date de la dernière connexion avec Moment.js
        const formattedLastConnexion = moment(user.last_connexion).format('DD/MM/YYYY HH:mm:ss');
        // Formater la date d'inscription avec Moment.js
        const formattedInscriptionDate = moment(user.inscription_date).format('DD/MM/YYYY HH:mm:ss');

        res.status(200).json({
            ...user.toJSON(),
            id: user.id,
            mail: user.mail,
            identifiant: user.identifiant,
            last_connexion: formattedLastConnexion,
            inscription_date: formattedInscriptionDate,
            Annonce: user.Annonces
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteUserAccount = async (req, res) => {

    const { id } = req.user;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        user.statut = 'supprimé';
        await user.save();

        res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
        console.error(chalk.red('Erreur lors de la suppression du compte:', error));
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { getUserInfo, getUserProfile, deleteUserAccount };