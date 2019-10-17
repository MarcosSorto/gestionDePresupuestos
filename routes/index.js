const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principalController');
const perfilController = require('../controllers/perfilController');

module.exports = () =>{
    router.get('/',principalController.mostrarPrincipal);

    router.get('/nuevo_Perfil',perfilController.mostrarFormPerfil );
    router.post('/nuevo_Perfil',perfilController.guardarPerfil);

    return router;
};