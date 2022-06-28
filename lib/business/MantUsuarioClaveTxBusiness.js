const usuarioClaveTxDao	= require('../dao/UsuarioClaveTxDao'); 
const utils 			= require('../utils/utils'); 
const config 			= require('../config/config.json'); 
const cryptoJS 			= require("crypto-js");
 
/**
 * @description Función que permite registrar una clave
 * @creation David Villanueva 06/12/2020
 * @update
 */
exports.registrarClave = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null; 
     try {
		 oRequest		 = utils.customRequest(req); 
		 //Registramos la clave del usuario
		 var oUsuarioClave = {};
		 oUsuarioClave.oAuditRequest  = oRequest.oAuditRequest;
		 oUsuarioClave.oData		  = oRequest.oData; 
		 oUsuarioClave.oData.iCodTipo = 0;
		 oUsuarioClave.oData.sClave   = cryptoJS.HmacSHA1(oRequest.oData.sClave, config.claveCripto).toString();
		 const crearClaveResponse = await  usuarioClaveTxDao.crearClave(oUsuarioClave); 
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
 * @description Función que permite actualizar una clave
 * @creation David Villanueva 06/04/2021
 * @update
 */
exports.actualizarClave = async (req, res) => { 
	var oResponse		= {};
	oResponse.oData		= {};
	var oRequest		= null; 
	try {
		oRequest		 = utils.customRequest(req);  
		//Eliminamos la Clave anterior
		var oParamElimUsuario = {};
		oParamElimUsuario.oAuditRequest = oRequest.oAuditRequest;
		oParamElimUsuario.oData			= {};
		oParamElimUsuario.oData.iUsuarioId = JSON.parse(oRequest.oAuditRequest.oInfoUsuario).Id;
		const eliminarClaveUsuarioResponse = await   usuarioClaveTxDao.eliminarClaveUsuario(oParamElimUsuario);
		if(eliminarClaveUsuarioResponse.iCode !== 1){
			throw new Error(eliminarClaveUsuarioResponse.iCode + "||" + eliminarClaveUsuarioResponse.sMessage);
		 }
		//Registramos la clave permantente del usuario
		var oUsuarioClave = {};
		oUsuarioClave.oAuditRequest  = oRequest.oAuditRequest;
		oUsuarioClave.oData		     = oRequest.oData; 
		oUsuarioClave.oData.iUsuarioId = JSON.parse(oRequest.oAuditRequest.oInfoUsuario).Id;
		oUsuarioClave.oData.iCodTipo = 1;
		oUsuarioClave.oData.sClave   = cryptoJS.HmacSHA1(oRequest.oData.sClave, config.claveCripto).toString();
		const crearClaveResponse = await  usuarioClaveTxDao.crearClave(oUsuarioClave); 
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
 * @description Función que permite resetear la clave
 * @creation David Villanueva 07/04/2021
 * @update
 */
 exports.resetearClave = async (req, res) => { 
	var oResponse		= {};
	oResponse.oData		= {};
	var oRequest		= null; 
	try {
		oRequest		 = utils.customRequest(req);  
		//Eliminamos la Clave anterior
		var oParamElimUsuario = {};
		oParamElimUsuario.oAuditRequest = oRequest.oAuditRequest;
		oParamElimUsuario.oData			= {};
		oParamElimUsuario.oData.iUsuarioId = oRequest.oData.iIdUsuario;
		const eliminarClaveUsuarioResponse = await   usuarioClaveTxDao.eliminarClaveUsuario(oParamElimUsuario);
		if(eliminarClaveUsuarioResponse.iCode !== 1){
			throw new Error(eliminarClaveUsuarioResponse.iCode + "||" + eliminarClaveUsuarioResponse.sMessage);
		 }
		//Registramos la clave permantente del usuario
		var oUsuarioClave = {};
		oUsuarioClave.oAuditRequest  = oRequest.oAuditRequest;
		oUsuarioClave.oData		     = oRequest.oData; 
		oUsuarioClave.oData.iUsuarioId = oRequest.oData.iIdUsuario;
		oUsuarioClave.oData.iCodTipo = 0;
		oUsuarioClave.oData.sClave   = cryptoJS.HmacSHA1(oRequest.oData.sClave, config.claveCripto).toString();
		const crearClaveResponse = await  usuarioClaveTxDao.crearClave(oUsuarioClave); 
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