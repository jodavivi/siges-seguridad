const Sequelize =  require('sequelize');
const db = require('../../config/db'); 
const Usuarios = require('./Usuario'); 

const UsuarioRol = db.define('usuario_rol', { 
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
    CodRol              : Sequelize.STRING(8),
    Rol                 : Sequelize.STRING(64)
} 
,
{
    schema: "sistemas",
});

Usuarios.hasMany(UsuarioRol, { as: "UsuarioRol",foreignKey: 'UsuarioId' });
UsuarioRol.belongsTo(Usuarios, { as: "Usuarios",targetKey: 'Id',foreignKey: 'UsuarioId' });  


module.exports = UsuarioRol;