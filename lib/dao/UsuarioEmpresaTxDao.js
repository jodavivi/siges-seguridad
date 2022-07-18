const usuarioEmpresaModel = require('../modelBd/entity/UsuarioEmpresa'); 
const utilsDao = require('./utils/utils'); 
const utilsGen = require('../utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite asignar una o varias empresas a un usuario 
 * @creation David Villanueva 04/07/2022
 * @update
 */
exports.crearUsuarioEmpresa = async function (oParam) { 
    const oResponse = {};
    try {
        var seqUsuarioEmpresa = "'" +config.seqUsuarioEmpresa +"'";
        var seq = await utilsDao.obtenetSequencia(seqUsuarioEmpresa);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oUsuarioEmpresa = {};
        oUsuarioEmpresa.Id               = parseInt(seq.oData, 10);
        oUsuarioEmpresa.EstadoId         = 1;
        oUsuarioEmpresa.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oUsuarioEmpresa.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuarioEmpresa.TerminalCreacion = oParam.oAuditRequest.sTerminal; 
        oUsuarioEmpresa.UsuarioId        = oParam.oData.iUsuarioId;
        oUsuarioEmpresa.CodTipo             = oParam.oData.sCodTipo; 
        oUsuarioEmpresa.CodEmpresa       = oParam.oData.sCodEmpresa;  
        oUsuarioEmpresa.RazonSocial      = oParam.oData.sRazonSocial; 
        oUsuarioEmpresa.CodEstadoItem    = oParam.oData.iCodEstadoItem;
        oUsuarioEmpresa.EstadoItem       = oParam.oData.sEstadoItem;
        const crearUsuarioEmpresaPromise = await usuarioEmpresaModel.create(oUsuarioEmpresa);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oUsuarioEmpresa;
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario_empresa, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}


/**
 * @description Función que permite actualizar usuarioEmpresa 
 * @creation David Villanueva 04/07/2022
 * @update
 */
exports.actualizarUsuarioEmpresa = async function (oParam) { 
    const oResponse = {};
    try {
        var oUsuarioEmpresa = {}; 
        oUsuarioEmpresa.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oUsuarioEmpresa.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuarioEmpresa.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        if(oParam.oData.sCodTipo !== undefined){
            oUsuarioEmpresa.CodTipo     = oParam.oData.sCodTipo; 
        }
        if(oParam.oData.sCodEmpresa !== undefined){
            oUsuarioEmpresa.CodEmpresa     = oParam.oData.sCodEmpresa; 
        }
        if(oParam.oData.sCodTipoDocumento !== undefined){
            oUsuarioEmpresa.CodTipoDocumento     = oParam.oData.sCodTipoDocumento; 
        }
         
        if(oParam.oData.sRazonSocial !== undefined){
            oUsuarioEmpresa.RazonSocial     = oParam.oData.sRazonSocial; 
        }
        if(oParam.oData.sRuc !== undefined){
            oUsuarioEmpresa.Ruc     = oParam.oData.sRuc; 
        } 
          
        if(oParam.oData.iCodEstadoItem !== undefined){
            oUsuarioEmpresa.CodEstadoItem     = oParam.oData.iCodEstadoItem; 
        }
        if(oParam.oData.sEstadoItem !== undefined){
            oUsuarioEmpresa.EstadoItem     = oParam.oData.sEstadoItem; 
        }
         
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarUsuarioPromise = await usuarioEmpresaModel.update(oUsuarioEmpresa, oFiltro);

        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oUsuarioEmpresa;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario_empresa, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}

/**
 * @description Función que permite eliminar la empresa de un usuario 
 * @creation David Villanueva 04/07/2022
 * @update
 */
exports.eliminarUsuarioEmpresa = async function (oParam) { 
    const oResponse = {};
    try {
        var oUsuarioEmpresa = {}; 
        oUsuarioEmpresa.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oUsuarioEmpresa.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuarioEmpresa.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        oUsuarioEmpresa.EstadoId             = 0;
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const eliminarUsuarioEmpresaPromise = await usuarioEmpresaModel.update(oUsuarioEmpresa, oFiltro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oUsuarioEmpresa;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario_empresa, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}