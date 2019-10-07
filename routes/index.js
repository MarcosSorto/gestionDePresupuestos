const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principalController');

module.exports = () =>{
    router.get("/",principalController.mostrarPrincipal);

    return router;
};