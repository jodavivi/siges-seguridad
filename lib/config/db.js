const { Sequelize } = require('sequelize');  
const config = require('./entorno.js');   
const db = new Sequelize(config.BD_NOMBRE, config.BD_USER, config.BD_PASS, {
  host: config.BD_HOST,
  dialect:  'postgres',
  port: config.BD_PORT,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false,
    freezeTableName: true
  } 
});

module.exports = db;