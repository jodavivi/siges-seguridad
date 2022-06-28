const Sequelize =  require('sequelize');
const vista = require('../modelBd/view/VUsuarioClave.json');
const db = require('../config/db');
const log4js = require("log4js");
const logger = log4js.getLogger("siges_seguridad"); 
/**
 * @description Función que permite validar login usuario
 * @creation David Villanueva 06/12/2020
 * @update
 */
exports.validarLoginUsuario = async function (oParam) { 
    const oResponse = {};
    var aFiltro     = [];
    try {
        var query = vista.viewUsuarioClave;
        query = query + ' and  upper(U."Usuario") =  ? and  XUC."Clave" = ?';
        
        aFiltro.push(oParam.sUsuario.toUpperCase());
        aFiltro.push(oParam.sClave);
        logger.debug('query: ' + query);
        logger.debug('sUsuario: ' + oParam.sUsuario.toUpperCase());
        logger.debug('sClave: ' + oParam.sClave);
        var aLista = await db.query(query, { 
            replacements: aFiltro,
            type: Sequelize.QueryTypes.SELECT
           });
           logger.debug('aLista: ' + aLista.length);
        if(aLista.length === 0){
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'Usuario no encontrado';
        }else{
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK';
            oResponse.oData     = aLista;
        }
        
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la consulta, error: '+ e.message+ ", Ubicación: " + e.stack.split("\n")[1].replace("    at ", "");
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}

/**
 * @description Función que permite obtener la ultima clave del usuario
 * @creation David Villanueva 06/04/2021
 * @update
 */
 exports.consultarUltimaClave = async function (oParam) { 
    const oResponse = {};
    var aFiltro     = [];
    try {
        var query = vista.viewUltimaClave;
        query = query + ' and  ucx."UsuarioId" =  ?';
        
        aFiltro.push(oParam.iIdUsuario); 

        var aLista = await db.query(query, { 
            replacements: aFiltro,
            type: Sequelize.QueryTypes.SELECT
           });
        if(aLista.length === 0){
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'Ultima clave no encontrado';
        }else{
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK';
            oResponse.oData     = aLista;
        }
        
    } catch (e) { 
        console.log(e);
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la consulta, error: '+ e.message+ ", Ubicación: " + e.stack.split("\n")[1].replace("    at ", "");
        oResponse.oData     = oParam;
    }  
     
    return oResponse;
}
