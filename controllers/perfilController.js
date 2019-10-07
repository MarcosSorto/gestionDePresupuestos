const mongoose = require('mongoose');

exports.mostrarFormPerfil = async( req, res, next)=>{
    res.render('perfil',{
        tituloPagina: 'control de presupuestos'
    });
}