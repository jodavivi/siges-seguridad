const aplicacionTxDao			= require('../dao/AplicacionTxDao');  
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite registrar una aplicacion
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.registrarAplicacion = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null;
     try {
		 oRequest		 = utils.customRequest(req); 
 
		 //Regustramos el Grupo
		 var oAplicacion = {};
		 oAplicacion.oAuditRequest = oRequest.oAuditRequest;
		 oAplicacion.oData		   = oRequest.oData;  
		 var oEmpresa =  JSON.parse(oRequest.oAuditRequest.oEmpresa);
		 if(oRequest.oData.iCodEstadoAplicacion === 1){
			oAplicacion.oData.sEstadoAplicacion = "Activo";
		 }else{
			oAplicacion.oData.sEstadoAplicacion = "Desactivo";
		 } 
		 oAplicacion.oData.sCodEmpresa	= oEmpresa.CodEmpresa;
		 oAplicacion.oData.sEmpresa		= oEmpresa.RazonSocial;
		 const crearAplicacionResponse = await  aplicacionTxDao.crearAplicacion(oAplicacion); 
		 if(crearAplicacionResponse.iCode !== 1){
			throw new Error(crearAplicacionResponse.iCode + "||" + crearAplicacionResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= crearAplicacionResponse.oData;
		
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
 * @description Función que permite actualizar una aplicacion
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.actualizarAplicacion = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		var oAplicacion = {};
		oAplicacion.oAuditRequest  = oRequest.oAuditRequest;
		oAplicacion.oData		   = oRequest.oData; 
		oAplicacion.oData.iId	   = parseInt(req.query.iId, 10); 
		if(oRequest.oData.iCodEstadoAplicacion === 1){
			oAplicacion.oData.sEstadoAplicacion = "Activo";
		 }else{
			oAplicacion.oData.sEstadoAplicacion = "Desactivo";
		 }
		const actualizarAplicacionResponse = await  aplicacionTxDao.actualizarAplicacion(oAplicacion);
		if(actualizarAplicacionResponse.iCode !== 1){
		   throw new Error(actualizarAplicacionResponse.iCode + "||" + actualizarAplicacionResponse.sMessage);
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
 * @description Función que permite eliminar aplicaciones
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.eliminarAplicacion = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		oRequest.oData.aItems.forEach(async function(e){
			var oAplicacion = {};
			oAplicacion.oAuditRequest  = oRequest.oAuditRequest;
			oAplicacion.oData		  = oRequest.oData; 
			oAplicacion.oData.iId	  = parseInt(e, 10); 
			const eliminarAplicacionResponse = await  aplicacionTxDao.eliminarAplicacion(oAplicacion);
			if(eliminarAplicacionResponse.iCode !== 1){
			throw new Error(eliminarAplicacionResponse.iCode + "||" + eliminarAplicacionResponse.sMessage);
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

