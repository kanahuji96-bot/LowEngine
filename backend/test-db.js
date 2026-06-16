process.env.DB_HOST = 'localhost'
process.env.DB_USER = 'root'
process.env.DB_PASS = ''
process.env.DB_NAME = 'toko_jualan'

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toko_jualan', 'root', '', {
  host: 'localhost',
  port: 3308,
  dialect: 'mysql',
  logging: false,
})

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database berhasil connect!')
    process.exit(0)
  })
  .catch(err => {
    console.log('❌ Error code   :', err.original?.code)
    console.log('❌ Error number :', err.original?.errno)
    console.log('❌ Error message:', err.message)
    console.log('❌ Full error   :', err.original?.sqlMessage || err.original?.message)
    process.exit(1)
  })
