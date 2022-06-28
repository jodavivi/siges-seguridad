const usuarioRxDao				= require('../dao/UsuarioRxDao'); 
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar usuario
 * @creation David Villanueva 04/12/2020
 * @update
 */
exports.consultarUsuario = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
     try { 
		 //Verificamos si ya exista la tabla
		 var oFiltroTabla = {};
		 oFiltroTabla.iId 			= req.query.iId; 
		 oFiltroTabla.sUsuario 		= req.query.sUsuario; 
		 oFiltroTabla.sCodigo 		= req.query.sCodigo; 
		 oFiltroTabla.sBuscaUsuario = req.query.sBuscaUsuario; 
		 oFiltroTabla.iCodEstadoUsuario = req.query.iCodEstadoUsuario;
		 var consultarUsuarioResponse 	=  await usuarioRxDao.consultarUsuario(oFiltroTabla);
		 if(consultarUsuarioResponse.iCode !== 1){
			throw new Error(consultarUsuarioResponse.iCode + "||" + consultarUsuarioResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= consultarUsuarioResponse.oData;
     } catch (e) {
        var oError = utils.customError(e);
		if (e.name === 'Error') {
			oResponse.iCode 	= oError.iCode; 
			oResponse.sMessage	= oError.sMessage;
		}else{
			oResponse.iCode 		= -2;
			oResponse.sMessage	= "Ocurrio un error en el proceso: " +  e.message +" ,Ubicación Error: "+oError.sMessage
		} 
     }finally{
     	oResponse.sIdTransaccion =  req.headers.sidtransaccion;
     	oResponse = utils.customResponse(oResponse);
     }  
     res.json(oResponse) 
};
