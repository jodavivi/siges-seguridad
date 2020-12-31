const grupoAplicacion = require('../modelBd/entity/GrupoAplicacion'); 
const utilsDao = require('./utils/utils'); 
const utilsGen = require('../utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite crear un grupo de aplicaciones 
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.crearGrupoAplicacion = async function (oParam) { 
    const oResponse = {};
    try {
        var seqGrupoAplicacion = "'" +config.seqGrupoAplicacion +"'";
        var seq = await utilsDao.obtenetSequencia(seqGrupoAplicacion);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oRegistro = {};
        oRegistro.Id               = parseInt(seq.oData, 10);
        oRegistro.EstadoId         = 1;
        oRegistro.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalCreacion = oParam.oAuditRequest.sTerminal;
        oRegistro.AplicacionId      = oParam.oData.iAplicacionId; 
        oRegistro.GrupoId          = oParam.oData.iGrupoId; 
         
        const crearGrupoAplicacionPromise = await grupoAplicacion.create(oRegistro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: grupo_aplicacion, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}


/**
 * @description Función que permite actualizar un grupo de aplicaciones
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.actualizarGrupoAplicacion = async function (oParam) { 
    const oResponse = {};
    try {
        var oRegistro = {}; 
        oRegistro.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        
        if(oParam.oData.iAplicacionId !== undefined){
            oRegistro.AplicacionId     = oParam.oData.iAplicacionId; 
        }
        if(oParam.oData.iGrupoId !== undefined){
            oRegistro.GrupoId     = oParam.oData.iGrupoId; 
        }
         
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarGrupoAplicacionPromise = await grupoAplicacion.update(oRegistro, oFiltro);

        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}

/**
 * @description Función que permite eliminar un grupo de aplicaciones 
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.eliminarGrupoAplicacion = async function (oParam) { 
    const oResponse = {};
    try {
        var oRegistro = {}; 
        oRegistro.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        oRegistro.EstadoId             = 0;
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarGrupoAplicacionPromise = await grupoAplicacion.update(oRegistro, oFiltro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}