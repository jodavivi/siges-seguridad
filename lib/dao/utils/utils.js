const Sequelize =  require('sequelize');
const db = require('../../config/db');

exports.obtenetSequencia = async function (sequencia) { 
    const oResponse = {};
    try {
        var aLista = await db.query("SELECT nextval("+sequencia+")", { 
            type: Sequelize.QueryTypes.SELECT
           });  
        oResponse.iCode    = 1;
        oResponse.sMessage = 'OK';
        oResponse.oData    = aLista[0].nextval;
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error al obtener la sequencia de ' +sequencia + ", Error: " +  e.message;
    }
    return oResponse;
}