const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const principalController = require("../controllers/principalController");
const perfilController = require("../controllers/perfilController");
const authController = require("../controllers/authController");
const categoriaController = require("../controllers/categoriaController");
const presupuestoCotroller = require("../controllers/presupuestoController");

module.exports = () => {
  router.get("/", principalController.mostrarPrincipal);

  //----------------------------------------------- rutas para la categoria

  //mostrar el perfil de crear categoria
  router.get(
    "/categoria/nuevaCategoria",
    authController.verificarUsuario,
    categoriaController.nuevaCategoria
  );

  //guardar una nueva categoria
  router.post(
    "/categoria/nuevaCategoria",
    authController.verificarUsuario,
    categoriaController.guardarCategoria
  );

  //listar las categorias
  router.get(
    "/categoria/listarCategoria",
    authController.verificarUsuario,
    categoriaController.listarCategorias
  );

  // listar las categorias inhabilitadas
  router.get(
    "/categoria/inhabilitadas",
    authController.verificarUsuario,
    categoriaController.listarCategoriasInhabilitadas
  );

  // habilitar una categoria inhabilitada
  router.post(
    "/categoria/habilitarCategoria/:url",
    authController.verificarUsuario,
    categoriaController.habilitarcategoria
  );

  //mostrar el formulario de editar la categoria
  router.get(
    "/categoria/editarCategoria/:url",
    authController.verificarUsuario,
    categoriaController.mostrarCategoria
  );

  //guardar cambios en una categoria
  router.post(
    "/categoria/editarCategoria/:url",
    authController.verificarUsuario,
    categoriaController.editarCategoria
  );

  // inhabilitar una categoria
  router.post(
    "/categorias/inhabilitarcategoria/:url",
    authController.verificarUsuario,
    categoriaController.inhabilitarCategoria
  );

  //----------------------------------------------- rutas parapresupuestos
  // listar todos los presupuestos de un usuario
  router.get(
    "/presupuesto/listaPresupuestos",
    authController.verificarUsuario,
    presupuestoCotroller.listarPresupuestos
  );

  //formulario de crear un nuevo presupuesto
  router.get(
    "/presupuesto/nuevoPresupuesto",
    authController.verificarUsuario,
    presupuestoCotroller.formularioCrearPresupuesto
  );
  // guardar un nuevo presupuesto
  router.post(
    "/presupuesto/nuevoPresupuesto",
    authController.verificarUsuario,
    presupuestoCotroller.guardarPresupuesto
  );

  // formulario para editar un presupuesto
  router.get(
    "/presupuesto/editarPresupuesto/:url",
    authController.verificarUsuario,
    presupuestoCotroller.formularioEditarPresupuesto
  );

  // guardar un presupuesto editado
  router.post(
    "/presupuesto/editarPresupuesto/:url",
    authController.verificarUsuario,
    presupuestoCotroller.editarPresupuesto
  );

  //eliminar un presupuesto
  router.delete(
    "/presupuesto/eliminar/:id",
    authController.verificarUsuario,
    presupuestoCotroller.eliminarPresupuesto
  );

  // mostramos el dasboard principal
  router.get(
    "/controPersonal",
    authController.verificarUsuario,
    principalController.mostrarDashUsuario
  );

  // opciones de filtrado de presupuestos
  router.post(
    "/presupuesto/filtrarPresupuesto",
    authController.verificarUsuario,
    presupuestoCotroller.busquedaPresupuesto
  );

  router.get("/nuevo_Perfil", perfilController.mostrarFormPerfil);
  router.get(
    "/editarPerfil",
    authController.verificarUsuario,
    perfilController.mostrarFormEditarPerfil
  );
  router.post(
    "/editarPerfil/:url",
    authController.verificarUsuario,
    perfilController.editarPerfil
  );
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
      check("confirmpassword", "Debes confirmar tu contraseña")
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
  router.get(
    "/cerrarSesion",
    authController.verificarUsuario,
    authController.cerrarSesion
  );

  return router;
};
