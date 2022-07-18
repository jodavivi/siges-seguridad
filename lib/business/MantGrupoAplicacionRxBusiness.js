const request				= require('request-promise-native');   
const grupoAplicacionRxDao	= require('../dao/GrupoAplicacionRxDao'); 
const aplicacionRxDao		= require('../dao/AplicacionRxDao'); 
const utils 				= require('../utils/utils'); 
 
/**
 * @description Función que permite consultar las aplicaciones por grupo
 * @creation David Villanueva 19/01/2021
 * @update
 */
exports.consultarGrupoAplicacion = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {}; 
	 var oRequest			= null;
     try { 
		 //Consultamos información de las aplicaciones
		 oRequest		 = utils.customRequest(req);  
		 var oFiltroGrupo 	= {};
		 oFiltroGrupo.iId  	= req.query.iId;  
		 oFiltroGrupo.sCodEmpresa 	= oRequest.oAuditRequest.sSociedad; 
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

/**
 * @description Función que permite consultar las aplicaciones por grupo faltantes por registrar
 * @creation David Villanueva 16/03/2021
 * @update
 */
 exports.consultarGrupoAplicacionDif = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData		= {}; 
	var oRequest			= null;
	try { 
		//Consultamos información de las aplicaciones
		oRequest		 = utils.customRequest(req);  
		var oFiltroGrupo 	= {};
		oFiltroGrupo.iId  	= req.query.iId;  
		oFiltroGrupo.sCodEmpresa 	= oRequest.oAuditRequest.sSociedad; 
		var consultarGrupoAplicacionResponse =  await grupoAplicacionRxDao.consultarGrupoAplicacion(oFiltroGrupo);
		if(consultarGrupoAplicacionResponse.iCode < 1){
		   throw new Error(consultarGrupoAplicacionResponse.iCode + "||" + consultarGrupoAplicacionResponse.sMessage);
		} 
		
		var aListaRegistrada = consultarGrupoAplicacionResponse.oData; 
		//Consultamos las aplicaciones activas 
		 var oFiltroAplicacion 					= {}; 
		 oFiltroAplicacion.sTipo  				= "P";
		 oFiltroAplicacion.iCodEstadoAplicacion = 1;
		 oFiltroAplicacion.sCodEmpresa 	= oRequest.oAuditRequest.sSociedad; 
		 var consultarAplicacionResponse =  await aplicacionRxDao.consultarAplicacion(oFiltroAplicacion);
		 if(consultarAplicacionResponse.iCode !== 1){
			throw new Error(consultarAplicacionResponse.iCode + "||" + consultarAplicacionResponse.sMessage);
		 } 
		 var aListaAplicaciones = consultarAplicacionResponse.oData; 
		 var aListaAppDisponible = [];
		 if(aListaRegistrada === undefined 
			|| aListaRegistrada === null
				|| aListaRegistrada.length === undefined ){
				aListaAppDisponible = aListaAplicaciones;
		 }else{

			var aListaDisponible = [];
			for (let index = 0; index < aListaAplicaciones.length; index++) {
				const element = aListaAplicaciones[index];
				var existe = false;
				for (let x = 0; x < aListaRegistrada.length; x++) {
					const e = aListaRegistrada[x];
					if(e.AplicacionId === element.Id){
						existe = true;
						break;
					}
				}
				if(!existe){
					aListaDisponible.push(element);
				}
				
			}
			aListaAppDisponible = aListaDisponible; 
		 }
  
		oResponse.iCode 		= 1; 
		oResponse.sMessage		= 'OK';
		oResponse.oData			= aListaAppDisponible;
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