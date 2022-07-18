const usuarioModel = require('../modelBd/entity/Usuario'); 
const usuarioRolModel = require('../modelBd/entity/UsuarioRol');
const usuarioMaestraModel = require('../modelBd/entity/UsuarioMaestra');
const usuarioEmpresaModel = require('../modelBd/entity/UsuarioEmpresa');
const utils = require('./utils/utils'); 
const config = require('../config/config.json');  
const Op = require('Sequelize').Op;

exports.consultarUsuario = async function (oFiltro) { 
    const oResponse = {};
    try {
        var oFiltroUsuario = {}; 
        oFiltroUsuario.where ={}; 
        if(oFiltro.iId !== undefined){
            oFiltroUsuario.where.Id  = oFiltro.iId; 
        }  
        if(oFiltro.sUsuario !== undefined){
            oFiltroUsuario.where.Usuario  =  {
                  [Op.iLike]:  oFiltro.sUsuario 
            }; 
        } 
        if(oFiltro.iCodEstadoUsuario !== undefined){
          oFiltroUsuario.where.CodEstadoUsuario  = oFiltro.iCodEstadoUsuario; 
        } 
        
        if(oFiltro.sCodigo !== undefined){
            oFiltroUsuario.where.Codigo  = oFiltro.sCodigo; 
        }
 
        if(oFiltro.sBuscaUsuario !== undefined
            && oFiltro.sBuscaUsuario !== null
                && oFiltro.sBuscaUsuario.length > 0){ 
            oFiltroUsuario.where = { 
                    [Op.or]: [
                      {
                        Codigo: {
                          [Op.eq]: oFiltro.sBuscaUsuario
                        }
                      },
                      {
                        NumDocumento: {
                            [Op.iLike]: '%'+oFiltro.sBuscaUsuario+'%'
                        }
                      },
                      {
                        Usuario: {
                          [Op.iLike]: '%'+oFiltro.sBuscaUsuario+'%'
                        }
                      } ,
                      {
                        Apellido: {
                          [Op.iLike]: '%'+oFiltro.sBuscaUsuario+'%'
                        }
                      }
                    ]
                  } 
        }
        
        oFiltroUsuario.where.EstadoId     = 1; 

        //Filtro para obtener usuarios por empresa
        var oFiltroEmpresa = {};
        oFiltroEmpresa.EstadoId = 1;
        if(oFiltro.sCodEmpresa!== undefined){ 
          oFiltroEmpresa.CodEmpresa = oFiltro.sCodEmpresa;
        }  
        //Filtro para obtener usuarios por empresa
        var oFiltroRol = {};
        oFiltroRol.EstadoId = 1;
        if(oFiltro.sCodEmpresa!== undefined){ 
          oFiltroRol.CodEmpresa = oFiltro.sCodEmpresa;
        }  
        oFiltroUsuario.include = [
                                    { model: usuarioRolModel, as: "UsuarioRol", where: oFiltroRol  ,required: false },
                                    { model: usuarioMaestraModel, as: "UsuarioMaestra", where: { EstadoId: 1 }  ,required: false },
                                    { model: usuarioEmpresaModel, as: "UsuarioEmpresa", where: oFiltroEmpresa  ,required: true }
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