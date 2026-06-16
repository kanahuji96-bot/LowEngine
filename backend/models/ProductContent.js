const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductContent = sequelize.define('ProductContent', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id:      { type: DataTypes.INTEGER, allowNull: false },
  table_of_contents: { type: DataTypes.TEXT, allowNull: true },
  features:          { type: DataTypes.TEXT, allowNull: true },
  full_description:  { type: DataTypes.TEXT, allowNull: true },
  demo_links:        { type: DataTypes.TEXT, allowNull: true }, // JSON array [{text, url}]
}, {
  tableName: 'product_contents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ProductContent;
