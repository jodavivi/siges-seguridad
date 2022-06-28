const express = require('express');
const router = express.Router();

const mantUsuarioTxBusiness       = require('../business/MantUsuarioTxBusiness');   
const mantUsuarioRxBusiness       = require('../business/MantUsuarioRxBusiness');
const mantUsuarioClaveTxBusiness  = require('../business/MantUsuarioClaveTxBusiness');  
const mantUsuarioClaveRxBusiness  = require('../business/MantUsuarioClaveRxBusiness');   

const mantGrupoTxBusiness       = require('../business/MantGrupoTxBusiness');   
const mantGrupoRxBusiness       = require('../business/MantGrupoRxBusiness');   
const mantRolTxBusiness         = require('../business/MantRolTxBusiness');   
const mantRolRxBusiness         = require('../business/MantRolRxBusiness');   
const mantAplicacionRolRxBusiness    = require('../business/MantAplicacionRolRxBusiness');
const mantAplicacionTxBusiness       = require('../business/MantAplicacionTxBusiness');
const mantAplicacionRxBusiness       = require('../business/MantAplicacionRxBusiness');
const mantGrupoAplicacionTxBusiness  = require('../business/MantGrupoAplicacionTxBusiness');  
const mantGrupoAplicacionRxBusiness  = require('../business/MantGrupoAplicacionRxBusiness');  
const mantAplicacionRolTxBusiness  = require('../business/MantAplicacionRolTxBusiness');   

module.exports = function(){

    //Usuario
    router.post('/usuario', mantUsuarioTxBusiness.registrarUsuario); 
    router.put('/usuario', mantUsuarioTxBusiness.actualizarUsuario); 
    router.delete('/usuario', mantUsuarioTxBusiness.eliminarUsuario);  
    router.get('/usuario', mantUsuarioRxBusiness.consultarUsuario); 
    
    router.post('/usuario/clave', mantUsuarioClaveTxBusiness.registrarClave); 
    router.post('/usuario/validausuario/', mantUsuarioClaveRxBusiness.validarLoginUsuario); 
    router.post('/usuario/generartoken', mantUsuarioClaveRxBusiness.generarToken); 
    router.get('/usuario/validaestadoclave', mantUsuarioClaveRxBusiness.verificarActualizarClave); 
    router.get('/usuario/estadoclave', mantUsuarioClaveRxBusiness.obtenerEstadoClave); 
    router.put('/usuario/clave', mantUsuarioClaveTxBusiness.actualizarClave); 
    router.put('/usuario/clave/reset', mantUsuarioClaveTxBusiness.resetearClave); 

    //rol
    router.post('/rol', mantRolTxBusiness.registrarRol); 
    router.put('/rol', mantRolTxBusiness.actualizarRol); 
    router.delete('/rol', mantRolTxBusiness.eliminarRol);  
    router.get('/rol', mantRolRxBusiness.consultarRoles); 
    router.get('/rol/aplicacion', mantAplicacionRolRxBusiness.consultarRolAplicacion); 
    router.post('/rol/aplicacion', mantAplicacionRolTxBusiness.registrarAplicacionRol); 
    router.get('/rol/aplicacionsinasignar', mantAplicacionRolRxBusiness.consultarRolAplicacionSinAsignar); 
    router.delete('/rol/aplicacion', mantAplicacionRolTxBusiness.eliminarAplicacionRol);  


    //grupos
    router.post('/grupo', mantGrupoTxBusiness.registrarGrupo); 
    router.put('/grupo', mantGrupoTxBusiness.actualizarGrupo); 
    router.delete('/grupo', mantGrupoTxBusiness.eliminarGrupo);  
    router.get('/grupo', mantGrupoRxBusiness.consultarGrupos);  
    
    //aplicaciones
    router.post('/aplicacion', mantAplicacionTxBusiness.registrarAplicacion); 
    router.put('/aplicacion', mantAplicacionTxBusiness.actualizarAplicacion); 
    router.delete('/aplicacion', mantAplicacionTxBusiness.eliminarAplicacion); 
    router.get('/aplicacion', mantAplicacionRxBusiness.consultarAplicacion); 

    //grupo aplicaciones
    router.post('/grupoaplicacion', mantGrupoAplicacionTxBusiness.registrarGrupoAplicacion); 
    router.put('/grupoaplicacion/:id', mantGrupoAplicacionTxBusiness.actualizarGrupoAplicacion); 
    router.delete('/grupoaplicacion', mantGrupoAplicacionTxBusiness.eliminarGrupoAplicacion); 
    router.get('/grupoaplicacion', mantGrupoAplicacionRxBusiness.consultarGrupoAplicacion); 
    router.get('/grupoaplicacion/faltante', mantGrupoAplicacionRxBusiness.consultarGrupoAplicacionDif);
 
    return router;
}

