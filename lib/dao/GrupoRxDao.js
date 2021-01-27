const grupoModel = require('../modelBd/entity/Grupo'); 
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite consultar los grupos
 * @creation David Villanueva 19/01/2021
 * @update
 */
exports.consultarGrupo = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroGrupoApp = {}; 
        oFiltroGrupoApp.where ={}; 
        if(oFiltro.iId !== undefined){
            oFiltroGrupoApp.where.Id    = oFiltro.iId; 
        }  
        oFiltroGrupoApp.where.EstadoId  = 1;  
        const consultarGrupoAppResponse = await  grupoModel.findAll(oFiltroGrupoApp); 
        if(consultarGrupoAppResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarGrupoAppResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de grupos'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: grupo, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}