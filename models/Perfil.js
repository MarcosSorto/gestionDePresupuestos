const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

// Definimos el esquema
const perfilSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: "El nombre del usuario es requerido.",
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    ocupacion:{
        type: String,
        trim: true
    },
    sueldo: {
        type: String,
        default: 0,
        required: "El sueldo del usuario es requerido.",
        trim: true
    },
    imagen: {
        type: String,
        trim: true,
        default: "imagenPerfil"
    },
    correo: {
        type: String,
        required: "Se requiere de un correo eletrónico",
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
module.exports = mongoose.model('perfil',perfilSchema);
