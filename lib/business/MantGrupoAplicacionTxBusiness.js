const grupoAplicacionTxDao		= require('../dao/GrupoAplicacionTxDao');  
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite registrar grupo de aplicaciones
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.registrarGrupoAplicacion = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null;
     try {
		 oRequest		 = utils.customRequest(req); 
 
		 //Registramos el Grupo de aplicaciones
		 
		 oRequest.oData.forEach(async function(e){
			var oGrupoAplicacion = {};
			oGrupoAplicacion.oAuditRequest = oRequest.oAuditRequest; 
			oGrupoAplicacion.oData = e;
			const crearGrupoAplicacionResponse = await  grupoAplicacionTxDao.crearGrupoAplicacion(oGrupoAplicacion); 
			if(crearGrupoAplicacionResponse.iCode !== 1){
				throw new Error(crearGrupoAplicacionResponse.iCode + "||" + crearGrupoAplicacionResponse.sMessage);
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


/**
 * @description Función que permite actualizar un grupo de aplicaciones
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.actualizarGrupoAplicacion = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		var oGrupoAplicacion = {};
		oGrupoAplicacion.oAuditRequest  = oRequest.oAuditRequest;
		oGrupoAplicacion.oData		   = oRequest.oData; 
		oGrupoAplicacion.oData.iId	   = parseInt(req.params.id, 10); 
		const actualizarGrupoAplicacionResponse = await  grupoAplicacionTxDao.actualizarGrupoAplicacion(oGrupoAplicacion);
		if(actualizarGrupoAplicacionResponse.iCode !== 1){
		   throw new Error(actualizarGrupoAplicacionResponse.iCode + "||" + actualizarGrupoAplicacionResponse.sMessage);
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
 * @description Función que permite eliminar grupo de aplicaciones
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.eliminarGrupoAplicacion = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos la tabla
		oRequest.oData.aItems.forEach(async function(e){
			var oGrupoAplicacion = {};
			oGrupoAplicacion.oAuditRequest  = oRequest.oAuditRequest;
			oGrupoAplicacion.oData		  = oRequest.oData; 
			oGrupoAplicacion.oData.iId	  = parseInt(e, 10); 
			const eliminarGrupoAplicacionResponse = await  grupoAplicacionTxDao.eliminarGrupoAplicacion(oGrupoAplicacion);
			if(eliminarGrupoAplicacionResponse.iCode !== 1){
			throw new Error(eliminarGrupoAplicacionResponse.iCode + "||" + eliminarGrupoAplicacionResponse.sMessage);
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

