// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
    },
    identifiant: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    inscription_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    last_connexion: {
        type: DataTypes.DATE,
    },
    statut: {
        type: DataTypes.ENUM('actif', 'suspendu', 'supprimé'),
        defaultValue: 'actif',
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;