const mongoose = require('mongoose');
const Perfil = mongoose.model('perfil');

exports.mostrarFormPerfil = async( req, res, next)=>{
    res.render('crearPerfil',{
        tituloPagina: 'control de presupuestos',
        layout: 'layout2'
        
    });
}

exports.guardarPerfil = async(req,res,next)=>{
    const perfil = new Perfil(req.body);
    console.log("entra al controlador pero vamos a ver los dats que trae");
    console.log(req.body);
    //almacenamos en la base de datos
   // const nuevoPerfil = await perfil.save();

    //redireccionamos al inicio
    res.redirect('/');
}