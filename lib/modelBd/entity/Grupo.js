const Sequelize =  require('sequelize');
const db = require('../../config/db'); 

//const modelUsuarioMaestra = require('./UsuarioMaestra'); 

const Grupo = db.define('grupo', { 
    Id : {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement : true
    },
    EstadoId            : Sequelize.INTEGER,
    UsuarioCreador      : Sequelize.STRING(64),
    FechaCreacion       : Sequelize.DATE,
    TerminalCreacion    : Sequelize.STRING(64),
    UsuarioModificador  : Sequelize.STRING,
    FechaModificacion   : Sequelize.DATE,
    TerminalModificador : Sequelize.STRING(64),
    TransaccionId       : Sequelize.STRING(64), 
    Nombre              : Sequelize.STRING(64),
    Descripcion         : Sequelize.STRING(128), 
    CodEstadoGrupo      : Sequelize.INTEGER
} 
,
{
    schema: "sistemas",
});
 

module.exports = Grupo;

