const Sequelize =  require('sequelize');
const db = require('../../config/db');  
const Aplicacion = require('./Aplicacion'); 

const AplicacionRol = db.define('aplicacion_rol', { 
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
    CodRol              : Sequelize.STRING(8),
    AplicacionId        : {
                            type: Sequelize.INTEGER,
                            references: {
                            model: 'aplicacion', // 'fathers' refers to table name
                            key: 'Id', // 'id' refers to column name in fathers table
                            }
                        }
} 
,
{
    schema: "sistemas",
}); 

Aplicacion.hasOne(AplicacionRol, { as: "AplicacionRol",foreignKey: 'AplicacionId' }); 
AplicacionRol.belongsTo(Aplicacion, { as: "Aplicacion",targetKey: 'Id',foreignKey: 'AplicacionId' });  

module.exports = AplicacionRol;