const db        = require('../config/db'); 
const Sequelize = require('sequelize');
const vista     = require('../modelBd/view/VUsuarioRolNoAsignado.json');
const usuarioRolModel = require('../modelBd/entity/UsuarioRol'); 
const rolModel = require('../modelBd/entity/Rol'); 
 
/**
 * @description Función que permite consultar los roles asignados al usuario
 * @creation David Villanueva 12/07/2022
 * @update
 */
exports.consultarUsuarioRol = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroUsuarioRol = {}; 
        oFiltroUsuarioRol.where ={}; 
        if(oFiltro.sCodEmpresa !== undefined){
            oFiltroUsuarioRol.where.CodEmpresa  = oFiltro.sCodEmpresa; 
        }   
        if(oFiltro.iUsuarioId !== undefined){
            oFiltroUsuarioRol.where.UsuarioId  = oFiltro.iUsuarioId; 
        }
        oFiltroUsuarioRol.where.EstadoId     = 1; 

        //Filtro para obtener los roles de la empresa
        var oFiltroRol = {};
        oFiltroRol.EstadoId = 1;
        if(oFiltro.sCodEmpresa!== undefined){ 
          oFiltroRol.CodEmpresa = oFiltro.sCodEmpresa;
        } 

         
        const consultarRolUsuarioAppResponse = await  usuarioRolModel.findAll(oFiltroUsuarioRol); 
        if(consultarRolUsuarioAppResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarRolUsuarioAppResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de roles del usuario'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: UsuarioRol, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}
 
/**
 * @description Función que permite consultar los usuarios no asignados
 * @creation David Villanueva 11/07/2022
 * @update
 */
 exports.consultarUsuarioRolNoAsignados = async function (oFiltro) { 
    const oResponse = {};
     var aFiltroRolUsuario     = [];
    try {
        var query = vista.viewUsuarioRolNoAsignado; 

        aFiltroRolUsuario.push(oFiltro.sCodEmpresa);
        aFiltroRolUsuario.push(oFiltro.sCodEmpresa);
        aFiltroRolUsuario.push(oFiltro.iUsuarioId);

          var aLista = await db.query(query, { 
            replacements: aFiltroRolUsuario,
            type: Sequelize.QueryTypes.SELECT
           }); 
        if(aLista.length === 0){
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de roles del usuario no asignadas';
        }else{
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK';
            oResponse.oData     = aLista;
        }
      
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario_rol, error: '+ e.message;
        oResponse.oData     = aFiltroRolUsuario;
    }  
    return oResponse;
}
 