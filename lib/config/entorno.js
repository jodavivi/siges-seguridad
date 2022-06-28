require('dotenv').config({path:process.env.NODE_ENV +'.env'});  
module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST,
    PORT: process.env.PORT, 
    BD_NOMBRE:process.env.BD_NOMBRE,
    BD_USER:process.env.BD_USER,
    BD_PASS:process.env.BD_PASS,
    BD_HOST:process.env.BD_HOST,
    BD_PORT:process.env.BD_PORT 
  }