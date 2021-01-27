const rolTxDao			= require('../dao/RolTxDao');  
const utils 			= require('../utils/utils'); 
 
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
		oTabla.oData.iId	  = parseInt(req.params.id, 10); 
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
		//actualizamos la tabla
		oRequest.oData.aItems.forEach(async function(e){
			var oUsuario = {};
			oUsuario.oAuditRequest  = oRequest.oAuditRequest;
			oUsuario.oData		  = oRequest.oData; 
			oUsuario.oData.iId	  = parseInt(e, 10); 
			const eliminarRolResponse = await  rolTxDao.eliminarRol(oUsuario);
			if(eliminarRolResponse.iCode !== 1){
			throw new Error(eliminarRolResponse.iCode + "||" + eliminarRolResponse.sMessage);
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

