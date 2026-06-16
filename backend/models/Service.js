const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:       { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  content:     { type: DataTypes.TEXT, allowNull: true },
  image:       { type: DataTypes.STRING, allowNull: true },
  tags:        { type: DataTypes.STRING, allowNull: true }, // comma separated
  date:        { type: DataTypes.DATEONLY, allowNull: true },
  status:      { type: DataTypes.ENUM('active','inactive'), defaultValue: 'active' },
}, {
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Service;
