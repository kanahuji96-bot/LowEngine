const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductGallery = sequelize.define('ProductGallery', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  image:      { type: DataTypes.STRING,  allowNull: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'product_gallery',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ProductGallery;
