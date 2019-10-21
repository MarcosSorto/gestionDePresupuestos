const mongoose = require("mongoose");
const Perfil = mongoose.model("perfil");

// Importar los módulos para direcciones (path)
const path = require("path");

// importar .... para eliminar archivos del servidor
const fs = require("fs");
const shortid = require("shortid");

const slug = require("slug");

//Mostrar la pantalla principal para el ingreso de datos del perfil.
exports.mostrarFormPerfil = async (req, res, next) => {
  res.render("crearPerfil", {
    tituloPagina: "control de presupuestos",
    layout: "layout2"
  });
};
// Guardar datos de un nuevo perfil de usuario
exports.guardarPerfil = async (req, res, next) => {
  const perfil = new Perfil(req.body);
  console.log(req.files);

  if (req.files) {
    // guardamos la imagen que ha sido seleccionada por el usuario.
    req.files.imagen.mv(
      path.join(__dirname, `../public/images/perfiles/${req.files.imagen.name}`)
    ),
      err => {
        if (err) {
          return res.status(500).send({ message: err });
        } else {
          console.log("listo");
        }
      };
    const url = slug(req.files.imagen.name).toLowerCase();
    perfil.imagen = `${url}-${shortid.generate()}`;

    // renombramos la imagen con el valor contenido en la base de datos
    fs.rename(
      path.join(
        __dirname,
        `../public/images/perfiles/${req.files.imagen.name}`
      ),
      path.join(__dirname, `../public/images/perfiles/${perfil.imagen}`),
      function(err) {
        if (err) console.log("ERROR: " + err);
      }
    );
  } else {
    // usuario no ha seleccionado ninguna foto, se inserta una por defecto.

    perfil.nombre = "defecto.jpg";
  }

  //almacenamos en la base de datos
  const nuevoPerfil = await perfil.save();

  //redireccionamos al inicio
  res.redirect("/");
};

// Guardar actualización de datos de perfil de usuario
exports.editarPerfil = async (req, res, next) => {
  const perfil = new Perfil(req.body);

  // guardamos los datos obtenidos.
};

// Mostrar el formulario de inicio de sesión
exports.formularioInicioSesion = (req, res) => {
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar sesión en control de presupuesto"
  });
};
