const Sequelize =  require('sequelize');
const db = require('../../config/db'); 
const Usuarios = require('./Usuario'); 

const UsuarioEmpresa = db.define('usuario_empresa', { 
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
    CodTipo             : Sequelize.STRING(4), 
    CodEmpresa          : Sequelize.STRING(4), 
    RazonSocial         : Sequelize.STRING(64), 
    Preferencia         : {
        
                            type:Sequelize.INTEGER, 
                            defaultValue: 0
                        },
    CodEstadoItem       : {
                                type: Sequelize.INTEGER,
                                comment: "0:Desactivado|1:Activado"
                          },
    EstadoItem          : Sequelize.STRING(32)
} 
,
{
    schema: "sistemas",
});
Usuarios.hasMany(UsuarioEmpresa, { as: "UsuarioEmpresa",foreignKey: 'UsuarioId' });
UsuarioEmpresa.belongsTo(Usuarios, { as: "Usuarios",targetKey: 'Id',foreignKey: 'UsuarioId' });  

module.exports = UsuarioEmpresa;