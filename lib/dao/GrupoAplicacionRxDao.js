const grupoAplicacionModel = require('../modelBd/entity/GrupoAplicacion'); 
const aplicacionModel = require('../modelBd/entity/Aplicacion'); 
const grupoModel = require('../modelBd/entity/Grupo'); 
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  

exports.consultarGrupoAplicacion = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroGrupoApp = {}; 
        oFiltroGrupoApp.where ={}; 
        oFiltroGrupoApp.where.EstadoId     = 1; 
        oFiltroGrupoApp.include = [
                                    { model: aplicacionModel, as: "Aplicacion" },
                                    { model: grupoModel, as: "Grupo" }  
                                ]
        const consultarGrupoAppResponse = await  grupoAplicacionModel.findAll(oFiltroGrupoApp); 
        if(consultarGrupoAppResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarGrupoAppResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de Aplicaciones por Grupo'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: GrupoAplicacion, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}