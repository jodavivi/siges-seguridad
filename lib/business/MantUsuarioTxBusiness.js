const usuarioTxDao				= require('../dao/UsuarioTxDao'); 
const usuarioRxDao				= require('../dao/UsuarioRxDao'); 
const usuarioRolTxDao			= require('../dao/UsuarioRolTxDao'); 
const usuarioClaveTxDao			= require('../dao/UsuarioClaveTxDao'); 
const cryptoJS 					= require("crypto-js");
const config 					= require('../config/config.json'); 
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
		 //Verificamos si ya exista el usuario
		 var oFiltroTabla = {};
		 oFiltroTabla.sUsuario = oRequest.oData.sUsuario; 
		 var consultarUsuarioResponse =  await usuarioRxDao.consultarUsuario(oFiltroTabla);
		 if(consultarUsuarioResponse.iCode !== 2){
			throw new Error(3 + "||" + "El Usuario: "+oRequest.oData.sUsuario +", ya existe.");
		 }
		 //Registramos el Usuario
		 var oTabla = {};
		 oTabla.oAuditRequest = oRequest.oAuditRequest;
		 oTabla.oData		  = oRequest.oData; 
		 oTabla.oData.sTipo	  = "U";
		 if(oRequest.oData.iCodEstadoUsuario  === 1){
			oTabla.oData.sEstadoUsuario = "Activo" ;
		 }else{
			oTabla.oData.sEstadoUsuario = "Desactivo"; 
		 } 
		 const crearUsuarioResponse = await  usuarioTxDao.crearUsuario(oTabla); 
		 if(crearUsuarioResponse.iCode !== 1){
			throw new Error(crearUsuarioResponse.iCode + "||" + crearUsuarioResponse.sMessage);
		 }
		 var oUsuarioNuevo  = crearUsuarioResponse.oData;
		 //Registramos el Rol
		 if(oRequest.oData.aRol !== undefined
			&& oRequest.oData.aRol !== null
			  && oRequest.oData.aRol.length > 0 ){
			
			var oRolUsuario = oRequest.oData.aRol[0]; 
			var oParamRol = {};
			oParamRol.oAuditRequest  = oRequest.oAuditRequest;
			oParamRol.oData		  = {}; 
			oParamRol.oData.iUsuarioId     = oUsuarioNuevo.Id;
			oParamRol.oData.sCodRol        = oRolUsuario.sCodRol;
			oParamRol.oData.sRol           = oRolUsuario.sRol;  
			var crearUsuarioRolResponse =  await  usuarioRolTxDao.crearUsuarioRol(oParamRol); 
			if(crearUsuarioRolResponse.iCode !== 1){
				throw new Error(crearUsuarioRolResponse.iCode + "||" + crearUsuarioRolResponse.sMessage);
			}

		 }

		//Registramos la clave Inicial
		var oUsuarioClave = {};
		oUsuarioClave.oAuditRequest = oRequest.oAuditRequest;
		oUsuarioClave.oData		  = {}; 
		oUsuarioClave.oData.sClave   = cryptoJS.HmacSHA1(oRequest.oData.sNumDocumento, config.claveCripto).toString();
		oUsuarioClave.oData.iUsuarioId = oUsuarioNuevo.Id;
		oUsuarioClave.oData.iCodTipo   = 0; //Clave temporal
		var crearClaveResponse =  await  usuarioClaveTxDao.crearClave(oUsuarioClave);
		if(crearClaveResponse.iCode !== 1){
			throw new Error(crearClaveResponse.iCode + "||" + crearClaveResponse.sMessage);
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

		//Verificamos si ya exista el usuario
		var oFiltroTabla = {};
		oFiltroTabla.iId = parseInt(req.query.iId, 10);  
		var consultarUsuarioResponse =  await usuarioRxDao.consultarUsuario(oFiltroTabla);
		if(consultarUsuarioResponse.iCode !== 1){
		   throw new Error(3 + "||" + "El Usuario: "+oRequest.oData.sUsuario +", no existe.");
		}
		var oUsuario = consultarUsuarioResponse.oData[0];
		//actualizamos la tabla
		var oTabla = {};
		oTabla.oAuditRequest  = oRequest.oAuditRequest;
		oTabla.oData		  = oRequest.oData; 
		oTabla.oData.iId	  = parseInt(req.query.iId, 10); 
		const actualizarUsuarioResponse = await  usuarioTxDao.actualizarUsuario(oTabla);
		if(actualizarUsuarioResponse.iCode !== 1){
		   throw new Error(actualizarUsuarioResponse.iCode + "||" + actualizarUsuarioResponse.sMessage);
		}
		
		if(oUsuario.UsuarioRol[0] !== undefined 
			&& oUsuario.UsuarioRol[0] !== null
				&& oUsuario.UsuarioRol[0].CodRol !== undefined
					&& oUsuario.UsuarioRol[0].CodRol !== null){
			
			if(oUsuario.UsuarioRol[0].CodRol !==  oRequest.oData.aRol[0].sCodRol){
				 //Eliminamos los roles asignados 
				 var oUsuarioRol = {};
				 oUsuarioRol.oAuditRequest  = oRequest.oAuditRequest;
				 oUsuarioRol.oData = {};
				 oUsuarioRol.oData.iUsuarioId = parseInt(req.query.iId, 10); 
				 const eliminarUsuarioRolResponse = await  usuarioRolTxDao.eliminarUsuarioRol(oUsuarioRol);
				 if(eliminarUsuarioRolResponse.iCode !== 1){
					throw new Error(eliminarUsuarioRolResponse.iCode + "||" + eliminarUsuarioRolResponse.sMessage);
				 }

				 //Asignamos el Rol 
				 var oParamRol = {};
				oParamRol.oAuditRequest  = oRequest.oAuditRequest;
				oParamRol.oData		  = {}; 
				oParamRol.oData.iUsuarioId     = parseInt(req.query.iId, 10); 
				oParamRol.oData.sCodRol        = oRequest.oData.aRol[0].sCodRol;
				oParamRol.oData.sRol           = oRequest.oData.aRol[0].sRol;  
				var crearUsuarioRolResponse =  await  usuarioRolTxDao.crearUsuarioRol(oParamRol); 
				if(crearUsuarioRolResponse.iCode !== 1){
					throw new Error(crearUsuarioRolResponse.iCode + "||" + crearUsuarioRolResponse.sMessage);
				}

			} 
		
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


		 //Eliminamos los roles asignados 
		 oRequest.oData.aItems.forEach(async function(e){
			var oUsuarioRol = {};
			oUsuarioRol.oAuditRequest  = oRequest.oAuditRequest;
			oUsuarioRol.oData = {};
			oUsuarioRol.oData.iUsuarioId =parseInt(e, 10); 
			const eliminarUsuarioRolResponse = await  usuarioRolTxDao.eliminarUsuarioRol(oUsuarioRol);
			if(eliminarUsuarioRolResponse.iCode !== 1){
				throw new Error(eliminarUsuarioRolResponse.iCode + "||" + eliminarUsuarioRolResponse.sMessage);
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

