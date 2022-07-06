const Sequelize =  require('sequelize');
const db = require('../../config/db');  

const Aplicacion = db.define('aplicacion', { 
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
    Ico                 : Sequelize.STRING(128),
    Url                 : Sequelize.STRING(128),
    Tipo                : Sequelize.STRING(4), 
    CodigoPadre         : Sequelize.STRING(16), 
    CodEstadoAplicacion : Sequelize.INTEGER,
    EstadoAplicacion    : Sequelize.STRING(32)
} 
,
{
    schema: "sistemas",
}); 

module.exports = Aplicacion;