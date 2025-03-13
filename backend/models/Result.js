const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Categorie = require('./Categorie');

const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categorie,
            key: 'id'
        }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    completed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'results',
    timestamps: false
});

Result.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Result.belongsTo(Categorie, {
    foreignKey: 'categorie_id',
    as: 'categorie'
});

module.exports = Result;