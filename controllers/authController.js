const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require("crypto");
const enviarEmail = require("../handlers/email");
const Usuario = mongoose.model("perfil");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/controPersonal",
  failureRedirect: "/iniciarSesion",
  failureFlash: true,
  badRequestMessage: ["Debes ingresar ambas credenciales"]
});

// Cerrar la sesión del usuario actual
exports.cerrarSesion = (req, res) => {
  // Cierra la sesión actual
  req.logout();

  req.flash("correcto", [
    "Has cerrado tu sesión correctamente. ¡Vuelve pronto!"
  ]);

  return res.redirect("/iniciarSesion");
};

// Verificar si el usuario se encuentra autenticado
exports.verificarUsuario = (req, res, next) => {
  // Retorna true si el usuario ya realizó la autenticación
  if (req.isAuthenticated()) {
    return next();
  }

  // Si no se autenticó, redirecccionarlo al inicio de sesión

  res.redirect("/iniciarSesion");
};

// Muestra el formulario de reseteo de contraseña
exports.formularioReestablecerPassword = (req, res) => {
  res.render("restablecerPassword", {
    nombrePagina: "Reestablece tu contraseña",
    layout: "layout2"
  });
};

exports.enviarToken = async (req, res) => {
  // Verificar si el correo electrónico es válido
  const usuario = await Usuario.findOne({ correo: req.body.email });

  // Si el usuario no existe
  if (!usuario) {
    req.flash("error", ["El correo electrónico ingresado no existe"]);
    return res.redirect("/restablecerPassword");
  }

  // El usuario existe, generar el token
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expira = Date.now() + 3600000;

  // Guardar el usuario
  await usuario.save();

  // Generar la URL
  const resetUrl = `http://${req.headers.host}/restablecerPassword/${usuario.token}`;

  // Enviar la notificación por email

  await enviarEmail.enviar({
    usuario,
    subject: "Reestablecer tu contraseña",
    template: "resetPassword",
    resetUrl
  });

  // Redireccionar
  req.flash("correcto", [
    "Verifica tu correo electrónico para seguir las instrucciones"
  ]);
  res.redirect("/iniciarSesion");
};

// Mostrar el formulario de cambio de contraseña
exports.formularioNuevoPassword = async (req, res) => {
  // buscar el usuario por medio del token y la fecha de expiración
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: { $gt: Date.now() }
  });

  // No se pudo encontrar el usuario con el token o token vencido
  if (!usuario) {
    req.flash("error", [
      "Solicitud expirada. Vuelve a solicitar el cambio de contraseña"
    ]);
    return res.redirect("/restablecerPassword");
  }

  // Mostrar el formulario de nueva password
  res.render("nuevaPassword", {
    layout: "layout2"
  });
};

// Almacena la nueva contraseña
exports.almacenarNuevaPassword = async (req, res) => {
  // buscar el usuario por medio del token y la fecha de expiración
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: { $gt: Date.now() }
  });

  // No se pudo encontrar el usuario con el token o token vencido
  if (!usuario) {
    req.flash("error", [
      "Solicitud expirada. Vuelve a solicitar el cambio de contraseña"
    ]);
    return res.redirect("/restablecerPassword");
  }

  // Obtener el nuevo password
  usuario.password = req.body.password;
  // Limpiar los valores que ya no son requeridos
  usuario.token = undefined;
  usuario.expira = undefined;

  // Almacenar los valores en la base de datos
  await usuario.save();

  // Redireccionar
  req.flash("correcto", ["Contraseña modificada correctamente"]);
  res.redirect("/iniciarSesion");
};
