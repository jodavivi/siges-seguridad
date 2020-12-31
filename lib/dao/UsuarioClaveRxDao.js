const Sequelize =  require('sequelize');
const vista = require('../modelBd/view/VUsuarioClave.json');
const db = require('../config/db');


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

        var aLista = await db.query(query, { 
            replacements: aFiltro,
            type: Sequelize.QueryTypes.SELECT
           });
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
