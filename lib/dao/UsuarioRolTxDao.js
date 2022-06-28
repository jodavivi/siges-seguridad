const usuarioRolModel = require('../modelBd/entity/UsuarioRol'); 
const utilsDao = require('./utils/utils'); 
const utilsGen = require('../utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite asignar un rol a un usuario
 * @creation David Villanueva 03/04/2021
 * @update
 */
exports.crearUsuarioRol = async function (oParam) { 
    const oResponse = {};
    try {
        var seqUsuarioRol = "'" +config.seqUsuarioRol +"'";
        var seq = await utilsDao.obtenetSequencia(seqUsuarioRol);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oRegistro = {};
        oRegistro.Id               = parseInt(seq.oData, 10);
        oRegistro.EstadoId         = 1;
        oRegistro.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalCreacion = oParam.oAuditRequest.sTerminal;
        
        oRegistro.UsuarioId     = oParam.oData.iUsuarioId;
        oRegistro.CodRol        = oParam.oData.sCodRol;
        oRegistro.Rol           = oParam.oData.sRol;  
        const crearUsuarioRolPromise = await usuarioRolModel.create(oRegistro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}
 
/**
 * @description Función que permite eliminar los roles del usuario
 * @creation David Villanueva 05/04/2021
 * @update
 */
exports.eliminarUsuarioRol = async function (oParam) { 
    const oResponse = {};
    try {
        var oRegistro = {}; 
        oRegistro.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oRegistro.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oRegistro.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        oRegistro.EstadoId             = 0;
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.UsuarioId = oParam.oData.iUsuarioId;
        oFiltro.where.EstadoId  = 1;
        const acrualizarGrupoPromise = await usuarioRolModel.update(oRegistro, oFiltro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oRegistro;
    } catch (e) {  
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}