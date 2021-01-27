const rolModel  = require('../modelBd/entity/Rol'); 
const utils     = require('./utils/utils'); 
const config    = require('../config/config.json');  

/**
 * @description Función que permite consultar los roles
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.consultarRol = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroRolApp = {}; 
        oFiltroRolApp.where ={}; 
        if(oFiltro.iId !== undefined){
            oFiltroRolApp.where.Id    = oFiltro.iId; 
        }  
        oFiltroRolApp.where.EstadoId  = 1;  
        const consultarRolResponse = await  rolModel.findAll(oFiltroRolApp); 
        if(consultarRolResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarRolResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de roles'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: rol, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}