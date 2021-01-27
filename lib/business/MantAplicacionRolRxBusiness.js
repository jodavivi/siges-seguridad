const request				= require('request-promise-native');   
const aplicacionRolRxDao	= require('../dao/AplicacionRolRxDao'); 
const utils 				= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar las aplicaciones por rol
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.consultarRolAplicacion = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
     try { 
		 //Consultamos información de las aplicaciones por rol
		 var oFiltroRol 	= {};  
		 oFiltroRol.aCodRol = []; 
		 if(req.query.sCodRol !== undefined && req.query.sCodRol !== null){
			oFiltroRol.aCodRol.push(req.query.sCodRol);   
		 } 
		 var consultarAplicacionRolResponse =  await aplicacionRolRxDao.consultarAplicacionRol(oFiltroRol);
		 if(consultarAplicacionRolResponse.iCode !== 1){
			throw new Error(consultarAplicacionRolResponse.iCode + "||" + consultarAplicacionRolResponse.sMessage);
		 } 
		  
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= consultarAplicacionRolResponse.oData;
     } catch (e) {
        var oError = utils.customError(e);
		if (e.name === 'Error') {
			oResponse.iCode 	= oError.iCode; 
			oResponse.sMessage	= oError.sMessage;
		}else{
			oResponse.iCode 		= -2;
			oResponse.sMessage	= "Ocurrio un error en el proceso: " +  e.message +" ,Ubicación Error: "+oError.sMessage
		} 
     }finally{
     	oResponse.sIdTransaccion =  req.headers.sidtransaccion;
     	oResponse = utils.customResponse(oResponse);
     }  
     res.json(oResponse) 
};
 