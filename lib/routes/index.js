const express = require('express');
const router = express.Router();

const mantUsuarioTxBusiness       = require('../business/MantUsuarioTxBusiness');   
const mantUsuarioRxBusiness       = require('../business/MantUsuarioRxBusiness');
const mantUsuarioClaveTxBusiness  = require('../business/MantUsuarioClaveTxBusiness');  
const mantUsuarioClaveRxBusiness  = require('../business/MantUsuarioClaveRxBusiness');   

const mantGrupoTxBusiness       = require('../business/MantGrupoTxBusiness');   
const mantAplicacionTxBusiness       = require('../business/MantAplicacionTxBusiness');
const mantGrupoAplicacionTxBusiness  = require('../business/MantGrupoAplicacionTxBusiness');  
const mantAplicacionRolTxBusiness  = require('../business/MantAplicacionRolTxBusiness');   

module.exports = function(){

    router.post('/usuario/', mantUsuarioTxBusiness.registrarUsuario); 
    router.put('/usuario/:id', mantUsuarioTxBusiness.actualizarUsuario); 
    router.delete('/usuario/', mantUsuarioTxBusiness.eliminarUsuario);  
    router.get('/usuario/', mantUsuarioRxBusiness.consultarUsuario); 
    
    router.post('/usuario/clave/', mantUsuarioClaveTxBusiness.registrarClave); 
    router.post('/usuario/validausuario/', mantUsuarioClaveRxBusiness.validarLoginUsuario); 
    router.post('/usuario/generartoken', mantUsuarioClaveRxBusiness.generarToken); 

    //grupos
    router.post('/grupo', mantGrupoTxBusiness.registrarGrupo); 
    router.put('/grupo/:id', mantGrupoTxBusiness.actualizarGrupo); 
    router.delete('/grupo', mantGrupoTxBusiness.eliminarGrupo);  
    //router.get('/grupo', mantGrupoTxBusiness.consultarUsuario); 
    
    //aplicaciones
    router.post('/aplicacion', mantAplicacionTxBusiness.registrarAplicacion); 
    router.put('/aplicacion/:id', mantAplicacionTxBusiness.actualizarAplicacion); 
    router.delete('/aplicacion', mantAplicacionTxBusiness.eliminarAplicacion); 

    //grupo aplicaciones
    router.post('/grupoaplicacion', mantGrupoAplicacionTxBusiness.registrarGrupoAplicacion); 
    router.put('/grupoaplicacion/:id', mantGrupoAplicacionTxBusiness.actualizarGrupoAplicacion); 
    router.delete('/grupoaplicacion', mantGrupoAplicacionTxBusiness.eliminarGrupoAplicacion); 

    //aplicaciones por rol
    router.post('/aplicacionrol', mantAplicacionRolTxBusiness.registrarAplicacionRol); 
    router.put('/aplicacionrol/:id', mantAplicacionRolTxBusiness.actualizarAplicacionRol); 
    router.delete('/aplicacionrol', mantAplicacionRolTxBusiness.eliminarAplicacionRol);  

    return router;
}

