const request					= require('request-promise-native');   
const aplicacionRxDao			= require('../dao/AplicacionRxDao'); 
const utils 					= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar las aplicaciones
 * @creation David Villanueva 18/01/2021
 * @update
 */
exports.consultarAplicacion = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
     try { 
		 //Consultamos información de las aplicaciones
		 var oFiltroAplicacion 	= {};
		 oFiltroAplicacion.iId  	= req.query.iId;  
		 var consultarAplicacionResponse =  await aplicacionRxDao.consultarAplicacion(oFiltroAplicacion);
		 if(consultarAplicacionResponse.iCode !== 1){
			throw new Error(consultarAplicacionResponse.iCode + "||" + consultarAplicacionResponse.sMessage);
		 } 
		  
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= consultarAplicacionResponse.oData;
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
 