const aplicacion = require('../modelBd/entity/Aplicacion'); 
const utilsDao = require('./utils/utils'); 
const utilsGen = require('../utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite registrar una aplicación 
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.crearAplicacion = async function (oParam) { 
    const oResponse = {};
    try {
        var seqAplicacion = "'" +config.seqAplicacion +"'";
        var seq = await utilsDao.obtenetSequencia(seqAplicacion);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oRegistro = {};
        oRegistro.Id               = parseInt(seq.oData, 10);
        oRegistro.EstadoId         = 1;
        oRegistro.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalCreacion = oParam.oAuditRequest.sTerminal; 
        oRegistro.Codigo           = utilsGen.generarCodigo(seq.oData,7,oParam.oData.sTipo);
        oRegistro.Nombre               = oParam.oData.sNombre;
        oRegistro.Descripcion          = oParam.oData.sDescripcion;
        oRegistro.Ico                  = oParam.oData.sIco;
        oRegistro.Url                  = oParam.oData.sUrl;
        oRegistro.Tipo                 = oParam.oData.sTipo;
        oRegistro.CodigoPadre          = oParam.oData.sCodigoPadre;
        oRegistro.CodEstadoAplicacion  = oParam.oData.iCodEstadoAplicacion;
        oRegistro.EstadoAplicacion      = oParam.oData.sEstadoAplicacion; 
        const crearAplicacionPromise = await aplicacion.create(oRegistro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: aplicacion, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}


/**
 * @description Función que permite actualizar una aplicacion 
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.actualizarAplicacion = async function (oParam) { 
    const oResponse = {};
    try {
        var oRegistro = {}; 
        oRegistro.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        if(oParam.oData.sNombre !== undefined){
            oRegistro.Nombre     = oParam.oData.sNombre; 
        }
        if(oParam.oData.sDescripcion !== undefined){
            oRegistro.Descripcion     = oParam.oData.sDescripcion; 
        }
        if(oParam.oData.sIco !== undefined){
            oRegistro.Ico     = oParam.oData.sIco; 
        }
        if(oParam.oData.sUrl !== undefined){
            oRegistro.Url     = oParam.oData.sUrl; 
        }
        if(oParam.oData.iCodEstadoAplicacion !== undefined){
            oRegistro.CodEstadoAplicacion     = oParam.oData.iCodEstadoAplicacion; 
        }
        if(oParam.oData.sEstadoAplicacion !== undefined){
            oRegistro.EstadoAplicacion     = oParam.oData.sEstadoAplicacion; 
        }
        if(oParam.oData.sTipo !== undefined){
            oRegistro.Tipo     = oParam.oData.sTipo; 
        }
        if(oParam.oData.sCodigoPadre !== undefined){
            oRegistro.CodigoPadre     = oParam.oData.sCodigoPadre; 
        }
 
         
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarAplicacionPromise = await aplicacion.update(oRegistro, oFiltro);

        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: aplicacion, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}

/**
 * @description Función que permite eliminar una aplicacion 
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.eliminarAplicacion = async function (oParam) { 
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
        const acrualizarAplicacionPromise = await aplicacion.update(oRegistro, oFiltro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: aplicacion, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}