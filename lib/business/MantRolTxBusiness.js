const rolTxDao				= require('../dao/RolTxDao');  
const utils 				= require('../utils/utils'); 
const aplicacionRolTxDao	= require('../dao/AplicacionRolTxDao');  
/**
 * @description Función que permite registrar un rol
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.registrarRol = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null;
     try {
		 oRequest		 = utils.customRequest(req); 
 
		 //Registramos el Rol
		 var oRol = {};
		 oRol.oAuditRequest = oRequest.oAuditRequest;
		 oRol.oData		    = oRequest.oData;  
		 oRol.oData.sTipo   = "R";
		 if(oRol.oData.iEstadoRolCod === 1){
			oRol.oData.sEstadoRol = "Activo";
		 }else{
			oRol.oData.sEstadoRol = "Desactivo";
		 } 
		 const crearRolResponse = await  rolTxDao.crearRol(oRol); 
		 if(crearRolResponse.iCode !== 1){
			throw new Error(crearRolResponse.iCode + "||" + crearRolResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= crearRolResponse.oData;
		
     } catch (e) {
        var oError = utils.customError(e);
		if (e.name === 'Error') {
			oResponse.iCode 	= oError.iCode; 
			oResponse.sMessage	= oError.sMessage;
		}else{
			oResponse.iCode 		= -2;
			oResponse.sMessage	= "Ocurrio un error en el proceso: " +  e.message +" ,Ubicación Error: "+oError.sMessage
		} 
		oResponse.oData	= oRequest.oData;
     }finally{
     	oResponse.sIdTransaccion =  req.headers.sidtransaccion;
     	oResponse = utils.customResponse(oResponse);
     }  
     res.json(oResponse) 
};


/**
 * @description Función que permite actualizar un rol
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.actualizarRol = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		var oTabla = {};
		oTabla.oAuditRequest  = oRequest.oAuditRequest;
		oTabla.oData		  = oRequest.oData; 
		oTabla.oData.iId	  = parseInt(req.query.iId, 10); 

		if(oTabla.oData.iEstadoRolCod === 1){
			oTabla.oData.sEstadoRol = "Activo";
		 }else{
			oTabla.oData.sEstadoRol = "Desactivo";
		 } 

		const actualizarRolResponse = await  rolTxDao.actualizarRol(oTabla);
		if(actualizarRolResponse.iCode !== 1){
		   throw new Error(actualizarRolResponse.iCode + "||" + actualizarRolResponse.sMessage);
		}
		oResponse.iCode 		= 1; 
		oResponse.sMessage		= 'OK';
	   
	} catch (e) {
	   var oError = utils.customError(e);
	   if (e.name === 'Error') {
		   oResponse.iCode 	= oError.iCode; 
		   oResponse.sMessage	= oError.sMessage;
	   }else{
		   oResponse.iCode 		= -2;
		   oResponse.sMessage	= "Ocurrio un error en el proceso: " +  e.message +" ,Ubicación Error: "+oError.sMessage
	   } 
	   oResponse.oData	= oRequest.oData;
	}finally{
		oResponse.sIdTransaccion =  req.headers.sidtransaccion;
		oResponse = utils.customResponse(oResponse);
	}  
	res.json(oResponse) 
};

/**
 * @description Función que permite eliminar un rol
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.eliminarRol = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//Eliminamos el rol
		oRequest.oData.aItems.forEach(async function(e){
			var oRol = {};
			oRol.oAuditRequest  = oRequest.oAuditRequest;
			oRol.oData		  = oRequest.oData; 
			oRol.oData.iId	  = parseInt(e.iId, 10); 
			const eliminarRolResponse = await  rolTxDao.eliminarRol(oRol);
			if(eliminarRolResponse.iCode !== 1){
			throw new Error(eliminarRolResponse.iCode + "||" + eliminarRolResponse.sMessage);
			} 
		});
		
		//Eliminamos las aplicaciones por Rol
		oRequest.oData.aItems.forEach(async function(e){
			var oAppRol = {};
			oAppRol.oAuditRequest   = oRequest.oAuditRequest;
			oAppRol.oData		     = oRequest.oData; 
			oAppRol.oData.sCodRol	 = e.sCodigo; 
			const eliminarAplicacionRolResponse = await  aplicacionRolTxDao.eliminarAplicacionxCodRol(oAppRol);
			if(eliminarAplicacionRolResponse.iCode !== 1){
			throw new Error(eliminarAplicacionRolResponse.iCode + "||" + eliminarAplicacionRolResponse.sMessage);
			} 
		});
		 

		oResponse.iCode 		= 1; 
		oResponse.sMessage		= 'OK';
	   
	} catch (e) {
	   var oError = utils.customError(e);
	   if (e.name === 'Error') {
		   oResponse.iCode 	= oError.iCode; 
		   oResponse.sMessage	= oError.sMessage;
	   }else{
		   oResponse.iCode 		= -2;
		   oResponse.sMessage	= "Ocurrio un error en el proceso: " +  e.message +" ,Ubicación Error: "+oError.sMessage
	   } 
	   oResponse.oData	= oRequest.oData;
	}finally{
		oResponse.sIdTransaccion =  req.headers.sidtransaccion;
		oResponse = utils.customResponse(oResponse);
	}  
	res.json(oResponse) 
};

