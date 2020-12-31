const Sequelize =  require('sequelize');
const db = require('../../config/db'); 

//const modelUsuarioMaestra = require('./UsuarioMaestra'); 

const Usuarios = db.define('usuario', { 
    Id : {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement : true
    },
    EstadoId            : {
                            type: Sequelize.INTEGER,
                            allowNull: false
                          },
    UsuarioCreador      : {
                                type: Sequelize.STRING(64),
                                allowNull: false
                            },
    FechaCreacion       : {
                                type: Sequelize.DATE,
                                allowNull: false
                            },
    TerminalCreacion    : Sequelize.STRING(64),
    UsuarioModificador  : Sequelize.STRING,
    FechaModificacion   : Sequelize.DATE,
    TerminalModificador : Sequelize.STRING(64),
    TransaccionId       : Sequelize.STRING(64),
    Codigo              : {
                                type: Sequelize.STRING(8),
                                allowNull: false
                            },
    Usuario             : {
                                type: Sequelize.STRING(64),
                                allowNull: false
                            },
    Email               : Sequelize.STRING(64),
    CodTipoDocumento    : Sequelize.STRING(8),
    TipoDocumento       : Sequelize.STRING(64),
    NumDocumento        : Sequelize.STRING(16),
    Nombre              : {
                                type: Sequelize.STRING(64),
                                allowNull: false
                            },
    Apellido            : {
                                type: Sequelize.STRING(128),
                                allowNull: false
                            },
    CodCargo            : {
                                type: Sequelize.STRING(8),
                                allowNull: false
                            },
    Cargo               : Sequelize.STRING(64),
    CodEstadoUsuario    : {
                                type: Sequelize.INTEGER ,
                                allowNull: false
                            }
} 
,
{
    schema: "sistemas",
});
 

module.exports = Usuarios;

