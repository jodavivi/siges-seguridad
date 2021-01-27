const request				= require('request-promise-native');   
const grupoAplicacionRxDao	= require('../dao/GrupoAplicacionRxDao'); 
const utils 				= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar las aplicaciones por grupo
 * @creation David Villanueva 19/01/2021
 * @update
 */
exports.consultarGrupoAplicacion = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
     try { 
		 //Consultamos información de las aplicaciones
		 var oFiltroGrupo 	= {};
		 oFiltroGrupo.iId  	= req.query.iId;  
		 var consultarGrupoAplicacionResponse =  await grupoAplicacionRxDao.consultarGrupoAplicacion(oFiltroGrupo);
		 if(consultarGrupoAplicacionResponse.iCode !== 1){
			throw new Error(consultarGrupoAplicacionResponse.iCode + "||" + consultarGrupoAplicacionResponse.sMessage);
		 } 
		  
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= consultarGrupoAplicacionResponse.oData;
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
 