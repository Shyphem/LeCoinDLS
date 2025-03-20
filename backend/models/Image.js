// models/Image.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    annonce_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'annonces',
            key: 'id',
        },
        allowNull: false,
    },
    image_base64: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    add_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'image',
    timestamps: false,
});

module.exports = Image;