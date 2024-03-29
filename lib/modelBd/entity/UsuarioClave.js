const Sequelize =  require('sequelize');
const db = require('../../config/db'); 
const Usuarios = require('./Usuario'); 

const UsuarioClave = db.define('usuario_clave', { 
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
    UsuarioId           : {
                            type: Sequelize.INTEGER,
                            references: {
                            model: 'usuario', // 'fathers' refers to table name
                            key: 'Id', // 'id' refers to column name in fathers table
                            }
                        },
    Clave              : Sequelize.STRING(64),
    CodTipo            : Sequelize.INTEGER // 0: Temporal, 1: Cambiada
} 
,
{
    schema: "sistemas",
});
Usuarios.hasMany(UsuarioClave, { as: "UsuarioClave",foreignKey: 'UsuarioId' });
UsuarioClave.belongsTo(Usuarios, { as: "Usuarios",targetKey: 'Id',foreignKey: 'UsuarioId' });  

module.exports = UsuarioClave;