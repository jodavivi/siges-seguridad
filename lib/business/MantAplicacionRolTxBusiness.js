const aplicacionRolTxDao		= require('../dao/AplicacionRolTxDao');  
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite registrar aplicaciones x rol
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.registrarAplicacionRol = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null;
     try {
		 oRequest		 = utils.customRequest(req); 
 
		 //Regustramos el Grupo de aplicaciones
		 var oAplicacionRol = {};
		 oAplicacionRol.oAuditRequest = oRequest.oAuditRequest;
		 oAplicacionRol.oData		   = oRequest.oData;  
		 const crearAplicacionRolResponse = await  aplicacionRolTxDao.crearAplicacionRol(oAplicacionRol); 
		 if(crearAplicacionRolResponse.iCode !== 1){
			throw new Error(crearAplicacionRolResponse.iCode + "||" + crearAplicacionRolResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= crearAplicacionRolResponse.oData;
		
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
 * @description Función que permite actualizar aplicaciones por rol
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.actualizarAplicacionRol = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		var oAplicacionRol = {};
		oAplicacionRol.oAuditRequest  = oRequest.oAuditRequest;
		oAplicacionRol.oData		   = oRequest.oData; 
		oAplicacionRol.oData.iId	   = parseInt(req.params.id, 10); 
		const actualizarAplicacionRolResponse = await  aplicacionRolTxDao.actualizarAplicacionRol(oAplicacionRol);
		if(actualizarAplicacionRolResponse.iCode !== 1){
		   throw new Error(actualizarAplicacionRolResponse.iCode + "||" + actualizarAplicacionRolResponse.sMessage);
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
 * @description Función que permite eliminar aplicaciones por rol
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.eliminarAplicacionRol = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		oRequest.oData.aItems.forEach(async function(e){
			var oAplicacionRol = {};
			oAplicacionRol.oAuditRequest  = oRequest.oAuditRequest;
			oAplicacionRol.oData		  = oRequest.oData; 
			oAplicacionRol.oData.iId	  = parseInt(e, 10); 
			const eliminarAplicacionRolResponse = await  aplicacionRolTxDao.eliminarAplicacionRol(oAplicacionRol);
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

