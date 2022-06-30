const jwt		 		= require('jsonwebtoken');
const usuarioClaveRxDao	= require('../dao/UsuarioClaveRxDao'); 
const usuarioRxDao		= require('../dao/UsuarioRxDao'); 
const aplicacionRolRxDao= require('../dao/AplicacionRolRxDao'); 
const grupoAplicacionRxDao	= require('../dao/GrupoAplicacionRxDao'); 
const utils 			= require('../utils/utils'); 
const config 			= require('../config/config.json'); 
const cryptoJS 			= require("crypto-js");



/**
 * @description Función que permite validar el acceso del usuario
 * @creation David Villanueva 06/12/2020
 * @update
 */
exports.validarLoginUsuario = async (req, res) => { 
	 var oResponse			= {};
	 oResponse.oData		= {};
	 var oRequest			= null; 
     try {
		 oRequest		 = utils.customRequest(req); 
		 //Validamos el acceso del usuario
		 var oUsuarioClave = {};
		 oUsuarioClave.sUsuario		  = oRequest.oData.sUsuario; 
		 oUsuarioClave.sClave   = cryptoJS.HmacSHA1(oRequest.oData.sClave, config.claveCripto).toString();
		 const validarLoginUsuarioResponse = await  usuarioClaveRxDao.validarLoginUsuario(oUsuarioClave); 
		 if(validarLoginUsuarioResponse.iCode !== 1){
			throw new Error(validarLoginUsuarioResponse.iCode + "||" + validarLoginUsuarioResponse.sMessage);
		 }
		 var oUsuarioClave = validarLoginUsuarioResponse.oData[0];
		 var oFiltroTabla = {};
		 oFiltroTabla.iId 			= oUsuarioClave.Id;  
		 var consultarUsuarioResponse 	=  await usuarioRxDao.consultarUsuario(oFiltroTabla);
		 if(consultarUsuarioResponse.iCode !== 1){
			throw new Error(consultarUsuarioResponse.iCode + "||" + consultarUsuarioResponse.sMessage);
		 }
		 var oUsuario = consultarUsuarioResponse.oData[0];
		  
		 var appPermitidos = [];
		 if(oUsuario.UsuarioRol !== undefined 
				&& oUsuario.UsuarioRol.length > 0){ 
					var oFiltroApp = {};
		 			oFiltroApp.aCodRol = []; 
					 oUsuario.UsuarioRol.forEach(function(e){
						oFiltroApp.aCodRol.push(e.CodRol); 
					 }); 
					var consultarAplicacionRolResponse 	=  await aplicacionRolRxDao.consultarAplicacionRol(oFiltroApp);
					if(consultarAplicacionRolResponse.iCode !== 1){
						throw new Error(consultarAplicacionRolResponse.iCode + "||" + consultarAplicacionRolResponse.sMessage);
					 }
					 appPermitidos = consultarAplicacionRolResponse.oData;
		 }
 
		 var oFiltroGrupoApp = {};
		 var consultarGrupoAplicacionResponse 	=  await  grupoAplicacionRxDao.consultarGrupoAplicacion(oFiltroGrupoApp);
		 if(consultarGrupoAplicacionResponse.iCode !== 1){
			throw new Error(consultarGrupoAplicacionResponse.iCode + "||" + consultarGrupoAplicacionResponse.sMessage);
		 }   
		 var aAppGrupoPermitido = [];
		 var aGrupos = [];
		 consultarGrupoAplicacionResponse.oData.forEach(function(e){ 
			 var noExiste = false;
			 for (let index = 0; index < aGrupos.length; index++) {
				 const element = aGrupos[index];  
				 if(element.Id === e.Grupo.Id){
					noExiste = true;
					break;
				 };
			 }
			 if(!noExiste){
				aGrupos.push(e.Grupo);
			 }
			
			var appPermitido = fnExisteAplicacion(appPermitidos, e.Aplicacion.Id);
			if(appPermitido){
				aAppGrupoPermitido.push(e);
			}
		 });  
		// console.log(JSON.stringify(aAppGrupoPermitido));
		 var aTreeGrupApp = [];
		 aGrupos.forEach(function(x, i){ 
			var oApp = {};
			oApp.NombreGrupo = x.Nombre;
			oApp.DescripcionGrupo = x.Descripcion;
			oApp.Aplicaciones =  []; 
			aAppGrupoPermitido.forEach(function(e){
				 if(e.GrupoId === x.Id){
					oApp.Aplicaciones.push(e.Aplicacion);
				 }
			});
			  
			aTreeGrupApp.push(oApp);
		 }); 
		 var oNewusuario = oUsuario.toJSON();
		 oNewusuario.Accesos = aTreeGrupApp; 
		 var sToken = jwt.sign( { data: JSON.stringify(oNewusuario) }, config.claveJwt, { expiresIn: config.tiempoExpiracion });		
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= sToken;
		
     } catch (e) {
		 console.log(e);
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
 * @description Función para valida si tiene permiso la aplicacion
 * @creation David Villanueva 27/12/2020
 * @update 
 */
function  fnExisteAplicacion (aListaApp, appPermisoId) {  
	try {
		var oResponse = false;
		for (let index = 0; index < aListaApp.length; index++) {
			const element = aListaApp[index];
			if(element.AplicacionId === appPermisoId){
				oResponse = true;
				break;
			}
			
		}
	} catch (e) {
		oResponse = false;
	}
	 
	return oResponse;
}

/**
 * @description Función que permite generar token
 * @creation David Villanueva 13/12/2020
 * @update
 */
exports.generarToken = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData			= {};
	var oRequest			= null; 
	try {
		oRequest		 = utils.customRequest(req); 
		//Validamos el acceso del usuario
	 
		var oUsuario = req.body;
		//var sToken = jwt.sign( JSON.stringify(oUsuario), config.claveJwt, {expiresIn: '1h'});
		var sToken = jwt.sign( { data: JSON.stringify(oUsuario) }, config.claveJwt, { expiresIn: config.tiempoSinExpiracion });		
		 oResponse.iCode 		= 1; 
		oResponse.sMessage		= 'OK';
		oResponse.oData		= sToken;
	   
	} catch (e) {
		console.log(e);
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
 * @description Función que permite verificar si tiene que actualizar la clave
 * @creation David Villanueva 06/04/2021
 * @update
 */
exports.verificarActualizarClave = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData			= {};
	var oRequest			= null; 
	try {
		oRequest		 = utils.customRequest(req);  
		var oParam = {};
		oParam.iIdUsuario = JSON.parse(oRequest.oAuditRequest.oInfoUsuario).Id;
		var consultarUltimaClaveResponse = await usuarioClaveRxDao.consultarUltimaClave(oParam);
		if(consultarUltimaClaveResponse.iCode !== 1){
			throw new Error(consultarUltimaClaveResponse.iCode + "||" + consultarUltimaClaveResponse.sMessage);
		 } 
		 var oUsuarioClave = consultarUltimaClaveResponse.oData[0];
		  
		if(oUsuarioClave.CodTipo === 0){ 
			throw new Error(2 + "||" + "Reiniciar la Clave");
		}

	    oResponse.iCode 		= 1; 
	    oResponse.sMessage		= 'OK';  
	   
	} catch (e) {
		console.log(e);
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
 * @description Función que permite obtener el estado de la clave
 * @creation David Villanueva 06/04/2021
 * @update
 */
 exports.obtenerEstadoClave = async (req, res) => { 
	var oResponse			= {};
	oResponse.oData			= {};
	var oRequest			= null; 
	try {
		oRequest		 = utils.customRequest(req);  
		var oParam = {};
		oParam.iIdUsuario = parseInt(req.query.iIdUsuario, 10);  
		var consultarUltimaClaveResponse = await usuarioClaveRxDao.consultarUltimaClave(oParam);
		if(consultarUltimaClaveResponse.iCode !== 1){
			throw new Error(consultarUltimaClaveResponse.iCode + "||" + consultarUltimaClaveResponse.sMessage);
		 } 
		 var oUsuarioClave = consultarUltimaClaveResponse.oData[0];
		 
		 var oEstadoClave  = {};
		 oEstadoClave.iCodTipoEstadoClave = oUsuarioClave.CodTipo;
		 if(oUsuarioClave.CodTipo === 0){ 
			oEstadoClave.sTipoEstadoClave = "Temporal";
		 }
		 if(oUsuarioClave.CodTipo === 1){ 
			oEstadoClave.sTipoEstadoClave = "Permanente";
		 }

	     oResponse.iCode 		= 1; 
	     oResponse.sMessage		= 'OK';  
		 oResponse.oData		= oEstadoClave;
	   
	} catch (e) {
		console.log(e);
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