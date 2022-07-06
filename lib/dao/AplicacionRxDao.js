const aplicacion = require('../modelBd/entity/Aplicacion'); 
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite consultar las aplicaciones
 * @creation David Villanueva 18/01/2021
 * @update
 */
exports.consultarAplicacion = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroAplicacion = {}; 
        oFiltroAplicacion.where ={}; 
        if(oFiltro.iId !== undefined){
            oFiltroAplicacion.where.Id  = oFiltro.iId; 
        }  
        if(oFiltro.sTipo !== undefined){
            oFiltroAplicacion.where.Tipo  = oFiltro.sTipo; 
        }
        if(oFiltro.iCodEstadoAplicacion !== undefined){
            oFiltroAplicacion.where.CodEstadoAplicacion  = oFiltro.iCodEstadoAplicacion; 
        } 
        if(oFiltro.sCodEmpresa!== undefined){ 
            oFiltroAplicacion.where.CodEmpresa = oFiltro.sCodEmpresa;
          } 
          
        oFiltroAplicacion.where.EstadoId     = 1; 
        const consultarAplicacionResponse = await  aplicacion.findAll(oFiltroAplicacion); 
        if(consultarAplicacionResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarAplicacionResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de aplicaciones'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: aplicacion, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}