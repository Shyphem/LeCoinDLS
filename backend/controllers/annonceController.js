// controllers/annonceController.js
const { Annonce, Categorie, Image, User, sequelize } = require('../models');
const moment = require('moment');
const { contientInsulte } = require('../utils/insultes');

const createAnnonce = async (req, res) => {
    const { categorie_id, title, prix, description, etat } = req.body; // Ajoutez `etat` ici
    const user_id = req.user.id; // Extraire l'ID de l'utilisateur à partir du token

    try {
        if (contientInsulte(title) || contientInsulte(description)) {
            res.status(400).json({ message: 'Votre annonce contient des insultes' });
        } else {
            const annonce = await Annonce.create({
                user_id,
                categorie_id,
                title,
                prix,
                description,
                etat // Assurez-vous que l'état est bien utilisé ici
            });

            // Ajoutez les images si elles existent
            if (req.files) {
                const images = req.files.map(file => ({
                    annonce_id: annonce.id,
                    image_base64: file.buffer.toString('base64')
                }));
                await Image.bulkCreate(images);
            }
            res.status(201).json(annonce);
        }
    } catch (error) {
        console.error('Erreur lors de la création de l\'annonce:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'annonce' });
    }
};

const getAnnonce = async (req, res) => {
    const { id } = req.params;

    try {
        const annonce = await Annonce.findByPk(id, {
            include: [Categorie, Image]
        });
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Formater la date de création avec Moment.js
        const formattedCreationDate = moment(annonce.creation_date).format('DD/MM/YYYY HH:mm');

        res.status(200).json({
            ...annonce.toJSON(),
            creation_date: formattedCreationDate,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'annonce:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'annonce' });
    }
};

const getAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.findAll({
            include: [Categorie, Image]
        });
        res.json(annonces);
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des annonces' });
    }
};

const searchAnnonces = async (req, res) => {
    const { query, categorie_id, etat, prix_max } = req.query;

    try {
        const where = {};
        if (query) {
            where.title = { [Op.like]: `%${query}%` };
        }
        if (categorie_id) {
            where.categorie_id = categorie_id;
        }
        if (etat) {
            where.etat = etat;
        }
        if (prix_max) {
            where.prix = { [Op.lte]: prix_max };
        }

        const annonces = await Annonce.findAll({
            where,
            include: [Categorie, Image]
        });
        res.json(annonces);
    } catch (error) {
        console.error('Erreur lors de la recherche des annonces:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche des annonces' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
};

const getEtats = async (req, res) => {
    try {
        const etats = Annonce.rawAttributes.etat.values;
        res.json(etats);
    } catch (error) {
        console.error('Erreur lors de la récupération des états:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des états' });
    }
};

const getLatestAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.findAll({
            limit: 4,
            order: [['creation_date', 'DESC']],
            include: [Categorie, Image]
        });
        res.json(annonces);
    } catch (error) {
        console.error('Erreur lors de la récupération des dernières annonces:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des dernières annonces' });
    }
};

const getAnnoncesByUser = async (req, res) => {
    const user_id = req.user.id;

    try {
        const annonces = await Annonce.findAll({
            where: { user_id },
            include: [Categorie, Image]
        });
        res.json(annonces);
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des annonces de l\'utilisateur' });
    }
};

const getAnnoncesByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const annonces = await Annonce.findAll({
            where: { user_id: id },
            include: [Categorie, Image]
        });
        res.json(annonces);
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des annonces de l\'utilisateur' });
    }
};

const deleteAnnonce = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const user = await User.findOne({ where: { id: user_id }, attributes: ['level'] });

    const transaction = await sequelize.transaction();

    try {
        let annonce = await Annonce.findOne({ where: { id, user_id }, transaction });

        if (user.level !== 'admin' && !annonce) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Annonce non trouvée ou vous n\'êtes pas autorisé à la supprimer' });
        }

        annonce = await Annonce.findOne({ where: { id }, transaction });

        // Supprimer les enregistrements dépendants dans la table `messages`
        await sequelize.query('DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE annonce_id = ?)', {
            replacements: [id],
            transaction
        });

        // Supprimer les enregistrements dépendants dans la table `conversations`
        await sequelize.query('DELETE FROM conversations WHERE annonce_id = ?', {
            replacements: [id],
            transaction
        });

        // Supprimer les enregistrements dépendants dans la table `image`
        await sequelize.query('DELETE FROM image WHERE annonce_id = ?', {
            replacements: [id],
            transaction
        });

        await annonce.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({ message: 'Annonce supprimée avec succès' });
    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la suppression de l\'annonce:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce' });
    }
};

const reportAnnonce = async (req, res) => {
    const { id } = req.params;

    try {
        const annonce = await Annonce.findByPk(id);

        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Mettre à jour l'attribut reported à true
        await annonce.update({ reported: true });

        res.status(200).json({ message: 'Annonce signalée avec succès' });
    } catch (error) {
        console.error('Erreur lors du signalement de l\'annonce:', error);
        res.status(500).json({ message: 'Erreur lors du signalement de l\'annonce' });
    }
};

const getReportedAnnonces = async (req, res) => {
    try {
        // Seuls les administrateurs devraient pouvoir voir les annonces signalées
        if (req.user.level !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent voir les annonces signalées' });
        }

        const reportedAnnonces = await Annonce.findAll({
            where: { reported: true },
            include: [Categorie, Image]
        });

        res.status(200).json(reportedAnnonces);
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces signalées:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des annonces signalées' });
    }
};

module.exports = { createAnnonce, getAnnonce, getAnnonces, searchAnnonces, getCategories, getEtats, getLatestAnnonces, getAnnoncesByUser, getAnnoncesByUserId, deleteAnnonce, reportAnnonce, getReportedAnnonces };