// models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Conversation = require('./Conversation');
const Annonce = require('./Annonce');
const Categorie = require('./Categorie');
const Image = require('./Image');
const ConversationParticipant = require('./ConversationParticipant');
const Message = require('./Message');

// Définir les associations entre les modèles
Annonce.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Annonce, { foreignKey: 'user_id' });

Annonce.belongsTo(Categorie, { foreignKey: 'categorie_id' });
Categorie.hasMany(Annonce, { foreignKey: 'categorie_id' });

Annonce.hasMany(Image, { foreignKey: 'annonce_id' });
Image.belongsTo(Annonce, { foreignKey: 'annonce_id' });

Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });

Conversation.belongsTo(Annonce, { foreignKey: 'annonce_id' });
Annonce.hasMany(Conversation, { foreignKey: 'annonce_id' });

Conversation.belongsToMany(User, { through: ConversationParticipant, foreignKey: 'conversation_id' });
User.belongsToMany(Conversation, { through: ConversationParticipant, foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Annonce,
    Categorie,
    Image,
    Message,
    Conversation,
    ConversationParticipant
};