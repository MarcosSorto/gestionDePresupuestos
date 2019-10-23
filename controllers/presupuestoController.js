const mongoose = require("mongoose");
const Presupuesto = mongoose.model("presupuesto");
const Categoria = mongoose.model("categoria");

// controlador para listar los presupuestos
exports.listarPresupuestos = async (req, res, next) => {
  // obtenemos el id del usuario registrado
  const elUsuario = req.user;

  // obtenemos todos los presupuestos disponibles del usuario
  const losPresupuestos = await Presupuesto.find({
    registradoPor: elUsuario._id
  });

  console.log(losPresupuestos);
  if (!losPresupuestos) return next();

  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 1
  });
  // mostramos la vista.
  res.render("listarPresupuesto", {
    losPresupuestos,
    titulo: "Control de presupuestos",
    elUsuario,
    layout: "layout3",
    lasCategorias
  });
};

//controlador para mostrar formulario de guardar presupuesto
exports.formularioCrearPresupuesto = async (req, res, next) => {
  // obtenemos el usuario autenticado
  const elUsuario = req.user;
  // obtenemos todas las categorias registradas por el usuario actual.
  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 1
  });

  // Si no existen categorias
  if (!lasCategorias) return next();
  res.render("crearPresupuesto", {
    layout: "layout4",
    lasCategorias
  });
};

exports.guardarPresupuesto = async (req, res) => {
  // obtenemos el usuario que ha registrado el presupuesto
  const elUsuario = req.user;

  const presupuesto = new Presupuesto(req.body);
  presupuesto.registradoPor = elUsuario._id;

  // guardamos el registro en la base de datos
  const nuevoPresupuesto = await presupuesto.save();
  res.redirect("/controPersonal");
};
