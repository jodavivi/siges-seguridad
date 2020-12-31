const usuarioClave = require('../modelBd/entity/UsuarioClave'); 
const utilsDao = require('./utils/utils');  
const config = require('../config/config.json');  

/**
 * @description Función que permite crear clave 
 * @creation David Villanueva 06/12/2020
 * @update
 */
exports.crearClave = async function (oParam) { 
    const oResponse = {};
    try {
        var seqUsuarioClave = "'" +config.seqUsuarioClave +"'";
        var seq = await utilsDao.obtenetSequencia(seqUsuarioClave);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oUsuario = {};
        oUsuario.Id               = parseInt(seq.oData, 10);
        oUsuario.EstadoId         = 1;
        oUsuario.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oUsuario.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuario.TerminalCreacion = oParam.oAuditRequest.sTerminal;
        oUsuario.UsuarioId        = oParam.oData.iUsuarioId;
        oUsuario.Clave            = oParam.oData.sClave;
        const crearTablaPromise   = await usuarioClave.create(oUsuario);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oUsuario;
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}
