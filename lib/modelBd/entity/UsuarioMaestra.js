const Sequelize =  require('sequelize');
const db = require('../../config/db'); 

const Usuarios = require('./Usuario'); 

const UsuarioMaestra = db.define('usuario_maestra', { 
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
    CodMaestra          : Sequelize.STRING(8),
    Maestra             : Sequelize.STRING(64)
} 
,
{
    schema: "sistemas",
});

 
Usuarios.hasMany(UsuarioMaestra, { as: "UsuarioMaestra",foreignKey: '\"UsuarioId\"' });
module.exports = UsuarioMaestra;

 