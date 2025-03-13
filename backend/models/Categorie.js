    const { DataTypes } = require('sequelize');
    const sequelize = require('../config/database');
    const User = require('./User');

    const Categorie = sequelize.define('Categorie', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        creator_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'categorie',
        timestamps: false
    });

    Categorie.belongsTo(User, {
        foreignKey: 'creator_id',
        as: 'creator'
    });

    module.exports = Categorie;