const grupoTxDao				= require('../dao/GrupoTxDao');  
const grupoAplicacionTxDao		= require('../dao/GrupoAplicacionTxDao');  
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite registrar un grupo
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.registrarGrupo = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null;
     try {
		 oRequest		 = utils.customRequest(req); 
 
		 //Registramos el Grupo
		 var oGrupo = {};
		 oGrupo.oAuditRequest = oRequest.oAuditRequest;
		 if(oRequest.oData.iCodEstadoGrupo === 1){
			oRequest.oData.sEstadoGrupo = "Activo"; 
		 }else{
			oRequest.oData.sEstadoGrupo = "Desactivo" 
		 }
		 oGrupo.oData		  = oRequest.oData;  
		 const crearGrupoResponse = await  grupoTxDao.crearGrupo(oGrupo); 
		 if(crearGrupoResponse.iCode !== 1){
			throw new Error(crearGrupoResponse.iCode + "||" + crearGrupoResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= crearGrupoResponse.oData;
		
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
 * @description Función que permite actualizar un grupo
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.actualizarGrupo = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//actualizamos el Grupo
		var oTabla = {};
		oTabla.oAuditRequest  = oRequest.oAuditRequest;
		oTabla.oData		  = oRequest.oData; 
		oTabla.oData.iId	  = parseInt(req.query.iId, 10); 
		if(oRequest.oData.iCodEstadoGrupo === 1){
			oRequest.oData.sEstadoGrupo = "Activo";
		 }else{
			oRequest.oData.sEstadoGrupo = "Desactivo";
		 }
		const actualizarGrupoResponse = await  grupoTxDao.actualizarGrupo(oTabla);
		if(actualizarGrupoResponse.iCode !== 1){
		   throw new Error(actualizarGrupoResponse.iCode + "||" + actualizarGrupoResponse.sMessage);
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
 * @description Función que permite eliminar un grupo
 * @creation David Villanueva 22/12/2020
 * @update
 */
exports.eliminarGrupo = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {};
	var oRequest			= null;
	try {
		oRequest		 = utils.customRequest(req);
		//eliminamos el Grupo
		oRequest.oData.aItems.forEach(async function(e){
			var oGrupo = {};
			oGrupo.oAuditRequest  = oRequest.oAuditRequest;
			oGrupo.oData		  = oRequest.oData; 
			oGrupo.oData.iId	  = parseInt(e, 10); 
			const eliminarGrupoResponse = await  grupoTxDao.eliminarGrupo(oGrupo);
			if(eliminarGrupoResponse.iCode !== 1){
			throw new Error(eliminarGrupoResponse.iCode + "||" + eliminarGrupoResponse.sMessage);
			} 
		});
		
		//Eliminamos las aplicaciones asignadas al grupo
		oRequest.oData.aItems.forEach(async function(e){
			var oGrupo = {};
			oGrupo.oAuditRequest  = oRequest.oAuditRequest;
			oGrupo.oData		  = oRequest.oData; 
			oGrupo.oData.iGrupoId	  = parseInt(e, 10); 
			const eliminarGrupoAplicacionxGrupoResponse = await  grupoAplicacionTxDao.eliminarGrupoAplicacionxGrupo(oGrupo);
			if(eliminarGrupoAplicacionxGrupoResponse.iCode !== 1){
			throw new Error(eliminarGrupoAplicacionxGrupoResponse.iCode + "||" + eliminarGrupoAplicacionxGrupoResponse.sMessage);
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

