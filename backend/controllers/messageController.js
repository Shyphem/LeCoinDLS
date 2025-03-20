// controllers/messageController.js
const { Conversation, Message, User, Annonce, Image, ConversationParticipant, sequelize } = require('../models');
const { Op } = require('sequelize');
const { contientInsulte } = require('../utils/insultes');

const getConversations = async (req, res) => {
    const userId = req.user.id;

    try {
        const conversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    through: {
                        model: ConversationParticipant,
                        where: { user_id: userId }
                    },
                    required: true // Assurez-vous que l'utilisateur connecté est un participant
                },
                {
                    model: Annonce,
                    include: [
                        {
                            model: User,
                        },
                        {
                            model: Image, // Inclure les images associées à l'annonce
                            attributes: ['image_base64'] // Inclure uniquement les informations nécessaires, ici l'image en base64
                        }
                    ]
                }
            ],
            order: [['updated_at', 'DESC']]
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getConversationDetails = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Vérifiez si l'utilisateur fait partie de la conversation
        const isParticipant = await ConversationParticipant.findOne({
            where: {
                conversation_id: id,
                user_id: userId
            }
        });

        if (!isParticipant) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        const messages = await Message.findAll({
            where: { conversation_id: id },
            include: [
                {
                    model: User,
                    as: 'sender'
                },
                {
                    model: Conversation,
                    include: [
                        {
                            model: User,
                            through: {
                                model: ConversationParticipant
                            }
                        },
                        {
                            model: Annonce,
                            include: [
                                {
                                    model: User,
                                },
                                {
                                    model: Image, // Inclure les images associées à l'annonce
                                    attributes: ['image_base64'] // Inclure uniquement les informations nécessaires, ici l'image en base64
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['created_at', 'ASC']]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createConversation = async (req, res) => {
    const { annonce_id, destinataire_id, content } = req.body;
    const sender_id = req.user.id;

    try {
        // Vérifiez si une conversation existe déjà entre les deux utilisateurs pour cette annonce
        let conversation = await sequelize.query(
            `SELECT c.id
             FROM conversations c
             JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
             JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
             WHERE c.annonce_id = :annonce_id
             AND cp1.user_id = :sender_id
             AND cp2.user_id = :destinataire_id
             GROUP BY c.id
             HAVING COUNT(DISTINCT cp1.user_id) = 1
             AND COUNT(DISTINCT cp2.user_id) = 1`,
            {
                replacements: { annonce_id, sender_id, destinataire_id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (conversation.length > 0) {
            return res.status(200).json({ conversation_id: conversation[0].id });
        }

        // Créez une nouvelle conversation si elle n'existe pas
        conversation = await Conversation.create({ annonce_id });

        // Ajouter les participants à la conversation
        await ConversationParticipant.bulkCreate([
            { conversation_id: conversation.id, user_id: sender_id },
            { conversation_id: conversation.id, user_id: destinataire_id }
        ]);

        // Créez le premier message dans la conversation
        /*await Message.create({
            conversation_id: conversation.id,
            sender_id,
            content
        });*/

        res.status(201).json({ conversation_id: conversation.id });
    } catch (error) {
        console.error('Erreur lors de la création de la conversation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const sendMessage = async (req, res) => {
    const { conversation_id, content } = req.body;
    const sender_id = req.user.id;

    try {
        if (contientInsulte(content)) {
            return res.status(400).json({ message: 'Votre message contient des insultes' });
        }

        const message = await Message.create({
            conversation_id,
            sender_id,
            content
        });

        await Conversation.update(
            { last_message: content, updated_at: new Date() },
            { where: { id: conversation_id } }
        );

        res.status(201).json(message);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { getConversations, getConversationDetails, sendMessage, createConversation };