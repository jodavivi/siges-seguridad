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
		 //Regustramos la clave del usuario
		 var oUsuarioClave = {};
		 oUsuarioClave.oAuditRequest = oRequest.oAuditRequest;
		 oUsuarioClave.oData		  = oRequest.oData; 
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

 