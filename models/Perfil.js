const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

// Definimos el esquema
const perfilSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: "El nombre del usuario esrequerido.",
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    sueldo: {
        type: String,
        default: 0,
        required: "El sueldo del usuario esrequerido.",
        trim: true
    },
    imagen: {
        type: String,
        trim: true
    },
    usuario: {
        type: String,
        required: "Se requiere de un nombre de usuario",
        trim: true
    },
    password: {
        type: String,
        required: "Se requiere de una contraseña de usuario",
        trim: true
    },
    url:{
        type: String,
        lowercase: true
    }
});


// hooks para generar la URl
perfilSchema.pre('save',function(next){
    //creamos la URL
    const url = slug(this.nombre);
    this.url = `${url}-${shortid.generate()}`;

    next();
});

//exportamos el model
module.exports = mongoose.model('Perfil',perfilSchema);