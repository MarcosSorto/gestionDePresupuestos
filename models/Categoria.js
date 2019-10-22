const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

// Definimos el esquema
const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: "El nombre de la categoria es requerido.",
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },

  registradoPor: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  }
});

// hooks para generar la URl
categoriaSchema.pre("save", function(next) {
  //creamos la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

//exportamos el model
module.exports = mongoose.model("categoria", categoriaSchema);
