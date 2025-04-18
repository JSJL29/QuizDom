const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: { 
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  }
}, {
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: false 
});

module.exports = User;