const aplicacionRolModel = require('../modelBd/entity/AplicacionRol'); 
const aplicacionModel = require('../modelBd/entity/Aplicacion'); 
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  

exports.consultarAplicacionRol = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroAppRol = {}; 
        oFiltroAppRol.where ={}; 
        if(oFiltro.aCodRol !== undefined){ 
            oFiltroAppRol.where.CodRol  = oFiltro.aCodRol; 
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