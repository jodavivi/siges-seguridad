const jwt		 			= require('jsonwebtoken');
const usuarioClaveRxDao		= require('../dao/UsuarioClaveRxDao'); 
const usuarioRxDao			= require('../dao/UsuarioRxDao'); 
const aplicacionRolRxDao	= require('../dao/AplicacionRolRxDao'); 
const grupoAplicacionRxDao	= require('../dao/GrupoAplicacionRxDao'); 
const utils 				= require('../utils/utils'); 
const config 				= require('../config/config.json'); 
const cryptoJS 				= require("crypto-js");  

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
		 oFiltroTabla.iCodEstadoItem = 1;
		 var consultarUsuarioResponse 	=  await usuarioRxDao.consultarUsuario(oFiltroTabla);
		 if(consultarUsuarioResponse.iCode !== 1){
			throw new Error(consultarUsuarioResponse.iCode + "||" + consultarUsuarioResponse.sMessage);
		 }
		 var oUsuarioResponse = consultarUsuarioResponse.oData[0];
		 var oUsuario 			= {};
		 oUsuario.Id       		= oUsuarioResponse.Id;          
		 oUsuario.Codigo		= oUsuarioResponse.Codigo;    
		 oUsuario.Usuario		= oUsuarioResponse.Usuario;   
		 oUsuario.Nombre		= oUsuarioResponse.Nombre;   
		 oUsuario.Apellido 		= oUsuarioResponse.Apellido;   
		 oUsuario.Email			= oUsuarioResponse.Email;    
		 oUsuario.CodTipoUsuario= oUsuarioResponse.CodTipoUsuario;   
		 //Concatenamos los accesos a la empresa 
		 var oEmpresaPermiso = {};
		 var oPermisosApp    = {};
		 var aEmpresasPermitas = [];
		 if(oUsuarioResponse.UsuarioEmpresa){
			oUsuarioResponse.UsuarioEmpresa.forEach(function(e, i){  
				oPermisosApp[e.CodEmpresa] ={ 
					"PermisosApp"    : {}
				};
				oEmpresaPermiso[e.CodEmpresa] = {
					"CodEmpresa":e.CodEmpresa,  
					"RazonSocial"    : e.RazonSocial,
					"Ruc"    : e.Ruc,  
					"Rol"			 : {} ,
					"Control"		 : {}
				}; 
				aEmpresasPermitas.push({ 
					"CodTipo":e.CodTipo, 
					"CodEmpresa":e.CodEmpresa,  
					"RazonSocial"    : e.RazonSocial 
				});
			}); 
		 } 
		// console.log(oUsuarioResponse.UsuarioRol);
		 if(oUsuarioResponse.UsuarioRol){
			oUsuarioResponse.UsuarioRol.forEach(function(e){  
				if(oEmpresaPermiso[e.CodEmpresa]){
					oEmpresaPermiso[e.CodEmpresa]["Rol"][e.CodRol] = true;     
				} 
			}); 
		 }
		  
		 var appPermitidos = [];   
		 if(oUsuarioResponse.UsuarioEmpresa !== undefined 
				&& oUsuarioResponse.UsuarioEmpresa.length > 0){ 
					var oFiltroApp = {};
		 			oFiltroApp.aCodEmpresa  = []; 
					 oFiltroApp.aCodRol		= [];
					 oUsuarioResponse.UsuarioEmpresa.forEach(function(e){
						oFiltroApp.aCodEmpresa.push(e.CodEmpresa); 
					 });  
					 oUsuarioResponse.UsuarioRol.forEach(function(e){  
						oFiltroApp.aCodRol.push(e.CodRol); 
					}); 
					var consultarAplicacionRolResponse 	=  await aplicacionRolRxDao.consultarAplicacionRol(oFiltroApp);
					if(consultarAplicacionRolResponse.iCode !== 1){
						throw new Error(consultarAplicacionRolResponse.iCode + "||" + consultarAplicacionRolResponse.sMessage);
					 }
					 appPermitidos = consultarAplicacionRolResponse.oData;  
					 appPermitidos.forEach(function(e){    
							oEmpresaPermiso[e.CodEmpresa]["Control"][e.Aplicacion.Codigo] = true;  
						if(oPermisosApp[e.CodEmpresa]["PermisosApp"]){ 
							oPermisosApp[e.CodEmpresa]["PermisosApp"][e.Aplicacion.Codigo] = true; 
						}  
				  	 });  
		 }
		 oUsuario.UsuarioEmpresa	= oEmpresaPermiso;  
		 //Generamos los grupos de aplicaciones pemritidas
		 var oAccesoPermitidos = {};
		 var oFiltroGrupoApp = {}; 
		 oFiltroGrupoApp.aCodEmpresa = []; 
		 oUsuarioResponse.UsuarioEmpresa.forEach(function(e){
			oAccesoPermitidos[e.CodEmpresa] = [];
		  oFiltroGrupoApp.aCodEmpresa.push(e.CodEmpresa); 
		 }); 
		 var consultarGrupoAplicacionResponse 	=  await  grupoAplicacionRxDao.consultarGrupoAplicacion(oFiltroGrupoApp);
		 if(consultarGrupoAplicacionResponse.iCode !== 1){
			throw new Error(consultarGrupoAplicacionResponse.iCode + "||" + consultarGrupoAplicacionResponse.sMessage);
		 }    
		 //creamos los grupos 
		 consultarGrupoAplicacionResponse.oData.forEach(function(e,i){  
			 var noExiste = false;
			 var grupoActual = 0;
			 for (let index = 0; index < oAccesoPermitidos[e.CodEmpresa].length; index++) {
				 const element = oAccesoPermitidos[e.CodEmpresa][index];   
				 grupoActual = index;
				 if(element.Id === e.Grupo.Id && element.CodEmpresa === e.Grupo.CodEmpresa){
					noExiste = true; 
					break;
				 };
			 }
			 if(!noExiste){
				oAccesoPermitidos[e.CodEmpresa].push({
					"Id"		   : e.Grupo.Id,
					"CodEmpresa"   : e.Grupo.CodEmpresa,
					"NombreGrupo" : e.Grupo.Nombre,
					"DescripcionGrupo" : e.Grupo.Descripcion,
					"Aplicaciones"		: []
				});

				grupoActual = oAccesoPermitidos[e.CodEmpresa].length - 1;
			 }

			 var isPermtido = oPermisosApp[e.CodEmpresa]["PermisosApp"][e.Aplicacion.Codigo];
			 if(isPermtido){
				oAccesoPermitidos[e.CodEmpresa][grupoActual]["Aplicaciones"].push({
					"Id":e.Aplicacion.Id,
					"CodEmpresa" : e.Aplicacion.CodEmpresa,
					"Codigo":e.Aplicacion.Codigo,
					"Nombre":e.Aplicacion.Nombre,
					"Descripcion":e.Aplicacion.Descripcion,
					"Ico":e.Aplicacion.Ico,
					"Url":e.Aplicacion.Url 
					});
			 } 
		 });  
		  
		 var oNewusuario = {};
		 oNewusuario.Datos   = oUsuario; 
		 oNewusuario.Accesos = oAccesoPermitidos; 
		 oNewusuario.Empresas = aEmpresasPermitas;
		 
		 //var sToken = jwt.sign( { data: JSON.stringify(oNewusuario) }, config.claveJwt, { expiresIn: config.tiempoExpiracion });		
     	 oResponse.iCode 		= 1; 
		 oResponse.sMessage		= 'OK';
		 oResponse.oData		= oNewusuario;
		
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
function  fnExisteAplicacion (aListaApp, appPermisoId, codEmpresa) {  
	try {
		var oResponse = false;
		for (let index = 0; index < aListaApp.length; index++) {
			const element = aListaApp[index];
			//console.log(element.Aplicacion);
			if(element.AplicacionId === appPermisoId   && element.CodEmpresa===codEmpresa){
				console.log("----------------------------------------");
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