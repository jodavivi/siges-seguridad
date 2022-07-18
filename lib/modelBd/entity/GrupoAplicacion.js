const Sequelize =  require('sequelize');
const db = require('../../config/db'); 

const Grupo = require('./Grupo');  
const Aplicacion = require('./Aplicacion');  

const GrupoAplicacion = db.define('grupo_aplicacion', { 
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
    AplicacionId        : {
                                type: Sequelize.INTEGER,
                                references: {
                                    model: 'aplicacion', // 'fathers' refers to table name
                                    key: 'Id', // 'id' refers to column name in fathers table
                                }
                            },
    GrupoId             : {
                            type: Sequelize.INTEGER,
                            references: {
                                model: 'grupo', // 'fathers' refers to table name
                                key: 'Id', // 'id' refers to column name in fathers table
                            }
                        }
} 
,
{
    schema: "sistemas",
});

//Usuarios.hasMany(UsuarioRol, { as: "UsuarioRol",foreignKey: '\"UsuarioId\"' });
GrupoAplicacion.belongsTo(Aplicacion, { as: "Aplicacion",targetKey: 'Id',foreignKey: 'AplicacionId' });   
GrupoAplicacion.belongsTo(Grupo, { as: "Grupo",targetKey: 'Id',foreignKey: 'GrupoId' });   
//Aplicacion.belongsTo(GrupoAplicacion, { as: "GrupoAplicacion",foreignKey: '\"AplicacionId\"' });

//GrupoAplicacion.belongsTo(Aplicacion, {  as: "Aplicacion", targetKey: '\"Id\"', foreignKey: '\"AplicacionId\"'}); 

module.exports = GrupoAplicacion;

 