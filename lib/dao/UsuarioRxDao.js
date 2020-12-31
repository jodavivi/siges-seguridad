const usuarioModel = require('../modelBd/entity/Usuario'); 
const usuarioRolModel = require('../modelBd/entity/UsuarioRol');
const usuarioMaestraModel = require('../modelBd/entity/UsuarioMaestra');
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  

exports.consultarUsuario = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroUsuario = {}; 
        oFiltroUsuario.where ={}; 
        if(oFiltro.iId !== undefined){
            oFiltroUsuario.where.Id  = oFiltro.iId; 
        } 
        if(oFiltro.sUsuario !== undefined){
            oFiltroUsuario.where.Usuario  = oFiltro.sUsuario; 
        } 
        if(oFiltro.sCodigo !== undefined){
            oFiltroUsuario.where.Codigo  = oFiltro.sCodigo; 
        }
        oFiltroUsuario.where.EstadoId     = 1; 
        oFiltroUsuario.include = [
                                    { model: usuarioRolModel, as: "UsuarioRol" },
                                    { model: usuarioMaestraModel, as: "UsuarioMaestra" }
                                ]
        const consultarUsuarioResponse = await  usuarioModel.findAll(oFiltroUsuario); 
        if(consultarUsuarioResponse.length > 0){
            oResponse.iCode     = 1;
            oResponse.sMessage  = 'OK'; 
            oResponse.oData     = consultarUsuarioResponse;
        }else{
            oResponse.iCode     = 2;
            oResponse.sMessage  = 'No se encontro información de Usuario'; 
            oResponse.oData     = oFiltro;
        }
    } catch (e) { 
        oResponse.iCode     = -1;
        oResponse.sMessage  = 'Ocurrio un error en la tabla: usuario, error: '+ e.message;
        oResponse.oData     = oFiltro;
    }  
    return oResponse;
}