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

    router.post('/usuario/', mantUsuarioTxBusiness.registrarUsuario); 
    router.put('/usuario/:id', mantUsuarioTxBusiness.actualizarUsuario); 
    router.delete('/usuario/', mantUsuarioTxBusiness.eliminarUsuario);  
    router.get('/usuario/', mantUsuarioRxBusiness.consultarUsuario); 
    
    router.post('/usuario/clave/', mantUsuarioClaveTxBusiness.registrarClave); 
    router.post('/usuario/validausuario/', mantUsuarioClaveRxBusiness.validarLoginUsuario); 
    router.post('/usuario/generartoken', mantUsuarioClaveRxBusiness.generarToken); 

    //rol
    router.post('/rol', mantRolTxBusiness.registrarRol); 
    router.put('/rol/:id', mantRolTxBusiness.actualizarRol); 
    router.delete('/rol', mantRolTxBusiness.eliminarRol);  
    router.get('/rol', mantRolRxBusiness.consultarRoles); 
    router.get('/rol/aplicacion', mantAplicacionRolRxBusiness.consultarRolAplicacion); 

    //grupos
    router.post('/grupo', mantGrupoTxBusiness.registrarGrupo); 
    router.put('/grupo/:id', mantGrupoTxBusiness.actualizarGrupo); 
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

    //aplicaciones por rol
    router.post('/aplicacionrol', mantAplicacionRolTxBusiness.registrarAplicacionRol); 
    router.put('/aplicacionrol/:id', mantAplicacionRolTxBusiness.actualizarAplicacionRol); 
    router.delete('/aplicacionrol', mantAplicacionRolTxBusiness.eliminarAplicacionRol);  

    return router;
}

