const mongoose = require("mongoose");
const Perfil = mongoose.model("perfil");
const { validationResult } = require("express-validator");

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
    layout: "layout2",
    Accion: "Crear Nuevo Perfil"
  });
};

// Guardar datos de un nuevo perfil de usuario
exports.guardarPerfil = async (req, res, next) => {
  const perfil = new Perfil(req.body);

  if (req.files) {
    // guardamos la imagen que ha sido seleccionada por el usuario.
    req.files.imagen.mv(
      path.join(__dirname, `../public/images/perfiles/${req.files.imagen.name}`)
    ),
      err => {
        if (err) {
          return res.status(500).send({ message: err });
        } else {
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

    perfil.imagen = "defecto.jpg";
  }

  // verificar que no hay errores
  const errores = validationResult(req);
  const erroresArray = [];

  // si hayerrores
  if (!errores.isEmpty()) {
    errores.array().map(error => erroresArray.push(error.msg));

    // enviamos los errores a la vista
    req.flash("error", erroresArray);
    const messages = req.flash();
    res.render("crearPerfil", {
      tituloPagina: "control de presupuestos",
      layout: "layout2",
      Accion: "Crear Nuevo Perfil",
      messages
    });
    return;
  }
  //almacenamos en la base de datos
  try {
    const nuevoPerfil = await perfil.save();
  } catch (error) {
    // ingresamos el error en la lista de errores
    erroresArray.push(error);
    req.flash("error", erroresArray);

    res.render("crearPerfil", {
      tituloPagina: "control de presupuestos",
      layout: "layout2",
      Accion: "Crear Nuevo Perfil",
      messages: req.flash()
    });
  }

  //redireccionamos al inicio
  res.redirect("/iniciarSesion");
};

//mostrando el formulario de editar
exports.mostrarFormEditarPerfil = (req, res) => {
  const elUsuario = req.user;
  res.render("editarPerfil", {
    elUsuario,
    layout: "layout4",
    Accion: "Editar tu perfil"
  });
};
// Guardar actualización de datos de perfil de usuario
exports.editarPerfil = async (req, res, next) => {
  const elPerfil = req.body;
  console.log(elPerfil);
  var laImagen = "";
  //validamos si se seleccionó otra imagen diferente
  console.log(req.files);
  if (req.files) {
    //  se seleccionó un logo diferente
    console.log("hay una nueva imagen");
    //1. guardar la nueva imagen.
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

    // 2. Eliminamos el logo anterior
    if (elPerfil.actual.trim() != "defecto.jpg") {
      fs.unlink(
        path.join(
          __dirname,
          `../public/images/perfiles/${elPerfil.actual.trim()}`
        ),
        err => {
          if (err) throw err;
        }
      );
    }

    // 3. identificador de la imagen
    const url = slug(req.files.imagen.name).toLowerCase();
    laImagen = `${url}-${shortid.generate()}`;

    // renombramos la imagen con el valor contenido en la base de datos
    fs.rename(
      path.join(
        __dirname,
        `../public/images/perfiles/${req.files.imagen.name}`
      ),
      path.join(__dirname, `../public/images/perfiles/${laImagen}`),
      function(err) {
        if (err) console.log("ERROR: " + err);
      }
    );
  } else {
    laImagen = "defecto.jpg";
  }
  elPerfil.imagen = laImagen;
  console.log(elPerfil.imagen);

  // guardamos los cambios registrados
  perfil = await Perfil.findOneAndUpdate({ url: req.params.url }, elPerfil, {
    new: true,
    runValidators: true
  });

  res.redirect("/controPersonal");
};

// Mostrar el formulario de inicio de sesión
exports.formularioInicioSesion = (req, res) => {
  res.render("iniciarSesion", {
    tituloPagina: "Control de presupuestos",
    layout: "layout2",
    Accion: "Iniciar Sesión en Control de presupuestos",
    messages: req.flash()
  });
};
