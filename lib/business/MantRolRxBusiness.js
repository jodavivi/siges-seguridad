const request				= require('request-promise-native');   
const rolRxDao				= require('../dao/RolRxDao'); 
const utils 				= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar los roles
 * @creation David Villanueva 20/01/2021
 * @update
 */
exports.consultarRoles = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
     try { 
		 //Consultamos información de los roles
		 var oFiltroRol 	= {};
		 oFiltroRol.iId  	= req.query.iId;  
		 var consultarRolResponse =  await rolRxDao.consultarRol(oFiltroRol);
		 if(consultarRolResponse.iCode !== 1){
			throw new Error(consultarRolResponse.iCode + "||" + consultarRolResponse.sMessage);
		 } 
		  
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= consultarRolResponse.oData;
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
 