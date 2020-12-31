const usuarioTxDao				= require('../dao/UsuarioTxDao'); 
const usuarioRxDao				= require('../dao/UsuarioRxDao'); 
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite registrar un usuario
 * @creation David Villanueva 04/12/2020
 * @update
 */
exports.registrarUsuario = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null;
     try {
		 oRequest		 = utils.customRequest(req); 
		 //Verificamos si ya exista la tabla
		 var oFiltroTabla = {};
		 oFiltroTabla.sUsuario = oRequest.oData.sUsuario; 
		 var consultarUsuarioResponse =  await usuarioRxDao.consultarUsuario(oFiltroTabla);
		 if(consultarUsuarioResponse.iCode !== 2){
			throw new Error(3 + "||" + "El Usuario: "+oRequest.oData.sUsuario +", ya existe.");
		 }
		 //Regustramos el Usuario
		 var oTabla = {};
		 oTabla.oAuditRequest = oRequest.oAuditRequest;
		 oTabla.oData		  = oRequest.oData; 
		 oTabla.oData.sTipo	  = "U";
		 const crearUsuarioResponse = await  usuarioTxDao.crearUsuario(oTabla); 
		 if(crearUsuarioResponse.iCode !== 1){
			throw new Error(crearUsuarioResponse.iCode + "||" + crearUsuarioResponse.sMessage);
		 }
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= crearUsuarioResponse.oData;
		
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
 * @description Función que permite actualizar una tabla Maestra
 * @creation David Villanueva 01/12/2020
 * @update
 */
exports.actualizarUsuario = async (req, res) => { 
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
		const actualizarUsuarioResponse = await  usuarioTxDao.actualizarUsuario(oTabla);
		if(actualizarUsuarioResponse.iCode !== 1){
		   throw new Error(actualizarUsuarioResponse.iCode + "||" + actualizarUsuarioResponse.sMessage);
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
 * @description Función que permite eliminar una tabla Maestra
 * @creation David Villanueva 02/12/2020
 * @update
 */
exports.eliminarUsuario = async (req, res) => { 
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
			const eliminarUsuarioResponse = await  usuarioTxDao.eliminarUsuario(oUsuario);
			if(eliminarUsuarioResponse.iCode !== 1){
			throw new Error(eliminarUsuarioResponse.iCode + "||" + eliminarUsuarioResponse.sMessage);
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

