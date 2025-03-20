// models/Annonce.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Annonce = sequelize.define('Annonce', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
        },
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    etat: {
        type: DataTypes.ENUM('Neuf', 'Très bon', 'Bon', 'Usagé'),
        allowNull: false,
    },
    statut: {
        type: DataTypes.ENUM('en_vente', 'vendu', 'suspendu'),
        defaultValue: 'en_vente',
    },
    creation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    reported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'annonces',
    timestamps: false,
});

module.exports = Annonce;