const config = require('./config/entorno.js'); 
const express = require('express');
const routes = require('./routes');
const utils = require('./utils/utils');
const path  = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const log4js = require("log4js");
 

//Crear Conexion a BD
const db = require('./config/db');

//importal modelo 
require('./modelBd/entity/Usuario');
require('./modelBd/entity/UsuarioMaestra');
require('./modelBd/entity/UsuarioRol');
require('./modelBd/entity/UsuarioClave'); 
require('./modelBd/entity/UsuarioEmpresa'); 
require('./modelBd/entity/Rol');
require('./modelBd/entity/Aplicacion');
require('./modelBd/entity/AplicacionRol');
require('./modelBd/entity/Grupo');

require('./modelBd/entity/GrupoAplicacion'); 


//Arrancar BD y creacion de tablas
db.sync()
    .then(()=> console.log('Conectado al Servidor'))
    .catch(error => console.log(error));

//crea un app de express
const app = express();
 
  log4js.configure({
    appenders: {
      siges_seguridad: {
        type: "dateFile",
        filename: "./log/siges-seguridad.log",
        pattern: "yyyy-MM-dd",
        compress: true,
      },
    },
    categories: {
      default: { appenders: ["siges_seguridad"], level: "debug" },
    },
  });
  
app.use(cors());

app.use((req, res, next) => { 
    next(); 
});
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
 

//uso de mildware
app.use((req, res, next) => {

  var oValidaDatosAuditoria  = utils.validaDatosAuditoria(req.headers);
    if(oValidaDatosAuditoria.iCode === 1){
        next();
    }else{
        res.status(406).send({
            error: oValidaDatosAuditoria.sMessage
          });
          return;
    }
    
});

//Inicia Routes
app.use('/seguridad/', routes());
 
//Servidor y puerto
const host = config.HOST;
const port = config.PORT; 
const logger = log4js.getLogger("siges_seguridad"); 
app.listen(port, host, () => {
     console.log('Servidor funcionando correctamente en el puerto: ' + port);
     logger.debug('Servidor funcionando correctamente en el puerto: ' + port); 
});