const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support both PostgreSQL (production) and MySQL (local)
const isPostgres = process.env.DATABASE_URL || process.env.DB_DIALECT === 'postgres';

let sequelize;

if (isPostgres && process.env.DATABASE_URL) {
  // Railway/Render PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Local MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
