const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const principalController = require("../controllers/principalController");
const perfilController = require("../controllers/perfilController");
const authController = require("../controllers/authController");
const categoriaController = require("../controllers/categoriaController");

module.exports = () => {
  router.get("/", principalController.mostrarPrincipal);

  // rutas para la categoria
  router.get("/categoria/nuevaCategoria", categoriaController.nuevaCategoria);
  router.post(
    "/categoria/nuevaCategoria",
    categoriaController.guardarCategoria
  );

  router.get(
    "/categoria/listarCategoria",
    categoriaController.listarCategorias
  );

  // mostramos el dasboard principal
  router.get("/controPersonal", principalController.mostrarDashUsuario);

  router.get("/nuevo_Perfil", perfilController.mostrarFormPerfil);
  router.get("/editarPerfil", perfilController.mostrarFormEditarPerfil);
  router.post("/editarPerfil/:url", perfilController.editarPerfil);
  router.post(
    "/nuevo_Perfil",
    [
      check("nombre", "El nombre de usuario es requerido.")
        .not()
        .isEmpty()
        .escape(),
      check("correo", "El correo electrónico es requerido.")
        .not()
        .isEmpty(),
      check("correo", "El correo electrónico no es válido.")
        .isEmail()
        .normalizeEmail(),
      check("password", "La contraseña es requerida.")
        .not()
        .isEmpty(),
      check("confirmpassword", "Debes confirmas tu contraseña")
        .not()
        .isEmpty(),
      check(
        "confirmpassword",
        "Las contraseñas ingresadas no son iguales, ¡revisa!"
      ).custom((value, { req }) => value === req.body.password)
    ],
    perfilController.guardarPerfil
  );

  // Iniciar sesión
  router.get("/iniciarSesion", perfilController.formularioInicioSesion);
  router.post("/iniciarSesion", authController.autenticarUsuario);

  // Cerrar sesión
  router.get("/cerrarSesion", authController.cerrarSesion);

  return router;
};
