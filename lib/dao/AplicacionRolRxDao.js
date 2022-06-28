const aplicacionRolModel = require('../modelBd/entity/AplicacionRol'); 
const aplicacionModel = require('../modelBd/entity/Aplicacion'); 
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  
const db = require('../config/db');  
const { QueryTypes } = require('sequelize');

/**
 * @description Función que permite consultar las aplicaciones por rol
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.consultarAplicacionRol = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroAppRol = {}; 
        oFiltroAppRol.where ={}; 
        if(oFiltro.aCodRol !== undefined){ 
            if(oFiltro.aCodRol !== null && oFiltro.aCodRol.length > 0){ 
             oFiltroAppRol.where.CodRol  = oFiltro.aCodRol; 
            }
        }  
        oFiltroAppRol.where.EstadoId     = 1; 
        oFiltroAppRol.include = [
                                    { model: aplicacionModel, as: "Aplicacion" } 
                                ]
        const consultarUsuarioResponse = await  aplicacionRolModel.findAll(oFiltroAppRol); 
        if(consultarUsuarioResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarUsuarioResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de Aplicaciones por Rol'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}

/**
 * @description Función que permite crear una aplicacion Rol 
 * @creation David Villanueva 24/03/2021
 * @update
 */
exports.consultarAplicacionxRolSinAsignar = async function (oFiltro) { 
    const oResponse = {};
    try {  
        const users = await db.query("select * from (select sa.\"Id\",  sa.\"Nombre\", sa.\"Descripcion\", sa.\"Ico\", sa.\"Url\", sa.\"Codigo\",sa.\"Tipo\",sa.\"CodigoPadre\",rs.\"Codigo\" as \"CodigoRol\",rs.\"Nombre\" as \"NombreRol\",rs.\"Descripcion\" as \"DescripcionRol\",(select count(*) from sistemas.aplicacion_rol ar where ar.\"CodRol\" = rs.\"Codigo\" and ar.\"AplicacionId\" = sa.\"Id\" and ar.\"EstadoId\" = 1 ) as \"NumAsignado\", aa.\"Nombre\" as \"NombrePadre\", aa.\"Descripcion\" as \"DescripcionPadre\" from (select a.\"Id\", a.\"EstadoId\", a.\"Nombre\", a.\"Descripcion\", a.\"Ico\", a.\"Url\", a.\"CodEstadoAplicacion\", a.\"EstadoAplicacion\",  a.\"Codigo\",a.\"Tipo\",a.\"CodigoPadre\",1 as \"Union\" from sistemas.aplicacion a where a.\"EstadoId\" = 1 and a.\"CodEstadoAplicacion\" = 1 ) sa inner join (select *, 1 as \"Union\" from sistemas.rol r where r.\"EstadoId\"= 1 ) rs on sa.\"Union\" = rs.\"Union\" left join sistemas.aplicacion aa on aa.\"Codigo\" = sa.\"CodigoPadre\") ssa where ssa.\"NumAsignado\" = 0 and ssa.\"CodigoRol\" = ?", 
                                        { replacements: [oFiltro.aCodRol],
                                            type: QueryTypes.SELECT 
                                        }
        );
        if(users.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = users;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de Aplicaciones'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: aplicaciones, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}