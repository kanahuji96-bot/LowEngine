const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentSetting = sequelize.define('PaymentSetting', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  method:       { type: DataTypes.STRING, allowNull: false }, // transfer, dana, ovo, gopay, qris, dll
  label:        { type: DataTypes.STRING, allowNull: false }, // nama tampil
  account_name: { type: DataTypes.STRING, allowNull: true  }, // nama rekening
  account_no:   { type: DataTypes.STRING, allowNull: true  }, // nomor rekening / nomor hp
  qr_image:     { type: DataTypes.STRING, allowNull: true  }, // nama file gambar QR
  whatsapp:     { type: DataTypes.STRING, allowNull: true  }, // nomor wa admin
  telegram:     { type: DataTypes.STRING, allowNull: true  }, // username telegram
  email:        { type: DataTypes.STRING, allowNull: true  }, // email konfirmasi
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
  sort_order:   { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'payment_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PaymentSetting;
