const mongoose = require('mongoose');

exports.mostrarPrincipal = async( req, res, next)=>{
    res.render('principal');
}