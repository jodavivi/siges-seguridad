const usuarioRolRxDao			= require('../dao/UsuarioRolRxDao'); 
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar los roles del usuario 
 * @creation David Villanueva 12/07/2022
 * @update
 */
 exports.consultarRolUsuario = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {}; 
	var oRequest			= null;
	try {  
		oRequest		 = utils.customRequest(req);  
		var oFiltroTabla = {};
		oFiltroTabla.sCodEmpresa 		= oRequest.oAuditRequest.sSociedad;  
		oFiltroTabla.iUsuarioId 		= req.query.iUsuarioId;   
		var consultarUsuarioRolResponse 	=  await usuarioRolRxDao.consultarUsuarioRol(oFiltroTabla);
		if(consultarUsuarioRolResponse.iCode !== 1){
		   throw new Error(consultarUsuarioRolResponse.iCode + "||" + consultarUsuarioRolResponse.sMessage);
		}
		 oResponse.iCode 		= 1; 
		oResponse.sMessage		= 'OK';
		oResponse.oData		= consultarUsuarioRolResponse.oData;
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


/**
 * @description Función que permite consultar los roles del usuario no asignados
 * @creation David Villanueva 11/07/2022
 * @update
 */
exports.consultarRolUsuarioNoAsignado = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
	 var oRequest			= null;
     try {  
		 oRequest		 = utils.customRequest(req);  
		 var oFiltroTabla = {};
		 oFiltroTabla.sCodEmpresa 		= oRequest.oAuditRequest.sSociedad;  
		 oFiltroTabla.iUsuarioId 		= req.query.iUsuarioId;   
		 var consultarUsuarioRolNoAsignadosResponse 	=  await usuarioRolRxDao.consultarUsuarioRolNoAsignados(oFiltroTabla);
		 if(consultarUsuarioRolNoAsignadosResponse.iCode !== 1){
			throw new Error(consultarUsuarioRolNoAsignadosResponse.iCode + "||" + consultarUsuarioRolNoAsignadosResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= consultarUsuarioRolNoAsignadosResponse.oData;
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
