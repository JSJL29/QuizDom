const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categorie = require('./Categorie');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categorie,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    option_a: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    option_b: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    option_c: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    option_d: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    correct_option: {
        type: DataTypes.ENUM('option_a', 'option_b', 'option_c', 'option_d'),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'questions',
    timestamps: false
});

Question.belongsTo(Categorie, {
    foreignKey: 'categorie_id',
    as: 'categorie'
});

module.exports = Question;