const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

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
  ocupacion: {
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
    default: "defecto.jpg"
  },
  correo: {
    type: String,
    required: "Se requiere de un correo eletrónico unico",
    trim: true
  },
  password: {
    type: String,
    required: "Se requiere de una contraseña de usuario",
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  }
});

// hooks para generar la URl
perfilSchema.pre("save", function(next) {
  //creamos la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

// Hooks (método) para hash + salt password
perfilSchema.pre("save", function(next) {
  const user = this;

  // Si el password ya fué modificado (ya hasheado)
  if (!user.isModified("password")) {
    return next();
  }

  // Generar el salt y si no hay error, hashear el password
  // Se almacena tanto el hash+salt para evitar ataques
  // de rainbow table.
  bcrypt.genSalt(10, (err, salt) => {
    // Si hay un error no continuar
    if (err) return next(err);

    // Si se produjo el salt, realizar el hash
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// Hooks para poder pasar los errores de MongoBD hacia express validator
perfilSchema.post("save", function(error, doc, next) {
  // Verificar que es un error de MongoDB
  if (error.name === "MongoError" && error.code === 11000) {
    next(
      "Ya existe un usuario con la dirección de correo electrónico ingresada"
    );
  } else {
    next(error);
  }
});

// Realizar un método que automáticamente verifique el password ingresado
// contra el almacenado (hash + salt)
perfilSchema.methods.compararPassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};
perfilSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  }).catch();
};
//exportamos el model
module.exports = mongoose.model("perfil", perfilSchema);
