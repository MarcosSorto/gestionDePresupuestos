const mongoose = require("mongoose");
const Categoria = mongoose.model("categoria");

// controlador para listar las categorias
exports.listarCategorias = async (req, res, next) => {
  // obtenemos el usuario autenticado
  const elUsuario = req.user;
  // obtenemos todas las categorias registradas por el usuario actual.
  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 1
  });

  // Si no existen categorias
  if (!lasCategorias) return next();
  console.log(lasCategorias);
  res.render("listaCategorias", {
    tituloPagina: "Control de presupuestos",
    layout: "layout3",
    lasCategorias
  });
};

//Controlador para mostar el perfil de categorias
exports.nuevaCategoria = (req, res) => {
  res.render("crearCategoria", {
    layout: "layout4"
  });
};

//controlador para guardar formulario de guardar categoria
exports.guardarCategoria = async (req, res) => {
  const categoria = new Categoria(req.body);
  const elUsuario = req.user;
  // agregamos el autor de la categoria
  categoria.registradoPor = elUsuario._id;

  // guardamos las categoria en la base de datos
  const nuevaCategoria = await categoria.save();

  // redireccionamos al dash principal
  res.redirect("/controPersonal");
};
