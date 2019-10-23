const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

// Definimos el esquema
const presupuestoSchema = new mongoose.Schema({
  concepto: {
    type: String,
    required: "descripcion del presupuesto es requerido.",
    trim: true
  },
  categoria: {
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
presupuestoSchema.pre("save", function(next) {
  //creamos la URL
  const url = slug(this.concepto);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

//exportamos el model
module.exports = mongoose.model("presupuesto", presupuestoSchema);
