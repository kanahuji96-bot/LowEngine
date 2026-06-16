const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Review = require('./Review');
const Service = require('./Service');
const ProductGallery = require('./ProductGallery');
const ProductContent = require('./ProductContent');
const PaymentSetting = require('./PaymentSetting');

// User relasi
User.hasMany(Order, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id' });

// Category relasi
Category.hasMany(Product, { foreignKey: 'category_id' });

// Product relasi
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.hasMany(Review, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

// Order relasi
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
Order.hasOne(Payment, { foreignKey: 'order_id' });
Order.hasMany(Review, { foreignKey: 'order_id' });

// OrderItem relasi
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Payment relasi
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// Review relasi
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });
Review.belongsTo(Order, { foreignKey: 'order_id' });

// Product content relasi
Product.hasOne(ProductContent, { foreignKey: 'product_id', as: 'content' });
ProductContent.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { sequelize, User, Category, Product, Order, OrderItem, Payment, Review, Service, ProductGallery, ProductContent, PaymentSetting };
