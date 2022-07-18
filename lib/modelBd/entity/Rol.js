const Sequelize =  require('sequelize');
const db = require('../../config/db'); 

//const modelUsuarioMaestra = require('./UsuarioMaestra'); 

const Rol = db.define('rol', { 
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
    CodEmpresa          : {
                                type: Sequelize.STRING(4),
                                allowNull: false
                          },
    Empresa             : {
                            type: Sequelize.STRING(64),
                            allowNull: false
                          }, 
    Codigo              : Sequelize.STRING(16),
    Nombre              : Sequelize.STRING(64),
    Descripcion         : Sequelize.STRING(128),  
    EstadoRolCod        : Sequelize.INTEGER,
    EstadoRol           : Sequelize.STRING(32)
} 
,
{
    schema: "sistemas",
});
 

module.exports = Rol;

