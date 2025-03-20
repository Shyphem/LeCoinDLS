// models/ConversationParticipant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConversationParticipant = sequelize.define('ConversationParticipant', {
    conversation_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'conversations',
            key: 'id',
        },
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
    },
}, {
    tableName: 'conversation_participants',
    timestamps: false,
});

module.exports = ConversationParticipant;