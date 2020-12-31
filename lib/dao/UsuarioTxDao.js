const generica = require('../modelBd/entity/Usuario'); 
const utilsDao = require('./utils/utils'); 
const utilsGen = require('../utils/utils'); 
const config = require('../config/config.json');  

/**
 * @description Función que permite crear usuario 
 * @creation David Villanueva 04/12/2020
 * @update
 */
exports.crearUsuario = async function (oParam) { 
    const oResponse = {};
    try {
        var seqUsuario = "'" +config.seqUsuario +"'";
        var seq = await utilsDao.obtenetSequencia(seqUsuario);
        if(seq.iCode !== 1){
            throw new Error(seq.iCode + "||" + seq.sMessage);
        }
        var oUsuario = {};
        oUsuario.Id               = parseInt(seq.oData, 10);
        oUsuario.EstadoId         = 1;
        oUsuario.UsuarioCreador   = oParam.oAuditRequest.sUsuario;
        oUsuario.FechaCreacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuario.TerminalCreacion = oParam.oAuditRequest.sTerminal;
        oUsuario.Codigo           = utilsGen.generarCodigo(seq.oData,7,oParam.oData.sTipo);
        oUsuario.Usuario          = oParam.oData.sUsuario;
        oUsuario.Email            = oParam.oData.sEmail;
        oUsuario.CodTipoDocumento = oParam.oData.sCodTipoDocumento;
        oUsuario.TipoDocumento    = oParam.oData.sTipoDocumento;
        oUsuario.NumDocumento     = oParam.oData.sNumDocumento;
        oUsuario.Nombre           = oParam.oData.sNombre;
        oUsuario.Apellido         = oParam.oData.sApellido;
        oUsuario.CodCargo         = oParam.oData.sCodCargo;
        oUsuario.Cargo            = oParam.oData.sCargo;
        oUsuario.CodEstadoUsuario = oParam.oData.iCodEstadoUsuario;
        const crearTablaPromise = await generica.create(oUsuario);
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


/**
 * @description Función que permite actualizar usuario 
 * @creation David Villanueva 04/12/2020
 * @update
 */
exports.actualizarUsuario = async function (oParam) { 
    const oResponse = {};
    try {
        var oUsuario = {}; 
        oUsuario.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oUsuario.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuario.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        if(oParam.oData.sEmail !== undefined){
            oUsuario.Email     = oParam.oData.sEmail; 
        }
        if(oParam.oData.sCodTipoDocumento !== undefined){
            oUsuario.CodTipoDocumento     = oParam.oData.sCodTipoDocumento; 
        }
        if(oParam.oData.sTipoDocumento !== undefined){
            oUsuario.TipoDocumento     = oParam.oData.sTipoDocumento; 
        }
        if(oParam.oData.sNumDocumento !== undefined){
            oUsuario.NumDocumento     = oParam.oData.sNumDocumento; 
        }
        if(oParam.oData.sApellido !== undefined){
            oUsuario.Apellido     = oParam.oData.sApellido; 
        }
        if(oParam.oData.sCodCargo !== undefined){
            oUsuario.CodCargo     = oParam.oData.sCodCargo; 
        }
        if(oParam.oData.sCargo !== undefined){
            oUsuario.Cargo     = oParam.oData.sCargo; 
        }
        if(oParam.oData.iCodEstadoUsuario !== undefined){
            oUsuario.CodEstadoUsuario     = oParam.oData.iCodEstadoUsuario; 
        }
         
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarUsuarioPromise = await generica.update(oUsuario, oFiltro);

        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oUsuario;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}

/**
 * @description Función que permite eliminar usuario 
 * @creation David Villanueva 04/12/2020
 * @update
 */
exports.eliminarUsuario = async function (oParam) { 
    const oResponse = {};
    try {
        var oUsuario = {}; 
        oUsuario.UsuarioModificador   = oParam.oAuditRequest.sUsuario;
        oUsuario.FechaModificacion    = new Date(oParam.oAuditRequest.dFecha);
        oUsuario.TerminalModificador  = oParam.oAuditRequest.sTerminal;
        oUsuario.EstadoId             = 0;
        var oFiltro      = {};
        oFiltro.where    = {};
        oFiltro.where.Id = oParam.oData.iId;
        const acrualizarTablaPromise = await generica.update(oUsuario, oFiltro);
        oResponse.iCode     = 1;
        oResponse.sMessage  = 'OK';
        oResponse.oData     = oUsuario;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}