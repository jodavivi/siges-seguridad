const rol       = require('../modelBd/entity/Rol'); 
const utilsDao  = require('./utils/utils'); 
const utilsGen  = require('../utils/utils'); 
const config    = require('../config/config.json');  
const utf8      = require('utf8'); 

/**
 * @description Función que permite crear un rol 
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.crearRol = async function (oParam) { 
    const oResponse = {};
    try {
        var seqRol = "'" +config.seqRol +"'";
        var seq = await utilsDao.obtenetSequencia(seqRol);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oRegistro = {};
        oRegistro.Id               = parseInt(seq.oData, 10);
        oRegistro.EstadoId         = 1;
        oRegistro.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalCreacion = oParam.oAuditRequest.sTerminal; 
        oRegistro.CodEmpresa       = oParam.oData.sCodEmpresa; 
        oRegistro.Empresa          = utf8.decode(oParam.oData.sEmpresa);
        if(oParam.oData.sCodigo === undefined){
            oRegistro.Codigo          = utilsGen.generarCodigo(seq.oData,6,oParam.oData.sTipo);
        }else{
            oRegistro.Codigo = oParam.oData.sCodigo;
        }
        
        oRegistro.Nombre          = oParam.oData.sNombre;
        oRegistro.Descripcion     = oParam.oData.sDescripcion;
        oRegistro.EstadoRolCod    = oParam.oData.iEstadoRolCod; 
        oRegistro.EstadoRol       = oParam.oData.sEstadoRol; 
        const crearRolPromise = await rol.create(oRegistro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: rol, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}


/**
 * @description Función que permite actualizar un rol
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.actualizarRol = async function (oParam) { 
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
        if(oParam.oData.iEstadoRolCod !== undefined){
            oRegistro.EstadoRolCod     = oParam.oData.iEstadoRolCod; 
        }
        if(oParam.oData.sEstadoRol !== undefined){
            oRegistro.EstadoRol     = oParam.oData.sEstadoRol; 
        }
         
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarRolPromise = await rol.update(oRegistro, oFiltro);

        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: rol, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}

/**
 * @description Función que permite eliminar un rol
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.eliminarRol = async function (oParam) { 
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
        const acrualizarRolPromise = await rol.update(oRegistro, oFiltro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: rol, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}