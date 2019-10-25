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
    lasCategorias,
    elUsuario
  });
};

// controlador para mostrar las categoriasinhabilitadas
exports.listarCategoriasInhabilitadas = async(req,res,next)=>{
  // obtenemos el usuario autenticado
  const elUsuario = req.user;
  // obtenemos todas las categorias registradas por el usuario actual.
  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 0
  });

  // Si no existen categorias
  if (!lasCategorias) return next();
  res.render("listarCategoriaInhabilitada", {
    tituloPagina: "Control de presupuestos",
    layout: "layout3",
    lasCategorias,
    elUsuario
  });
};






//Controlador para mostar el perfil de categorias
exports.nuevaCategoria = (req, res) => {
  res.render("crearCategoria", {
    layout: "layout4"
  });
};

//controlador para mostrar formulario de guardar categoria
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

//controlador para mostrar formulario de editar
exports.mostrarCategoria = async (req, res, next) => {
  // obtenemos el usuario autenticado
  const elUsuario = req.user;

  // obtenemosl a categoria a editar mediante la url enviada en la dirección
  const laCategoria = await Categoria.findOne({ url: req.params.url });

  // Si no hay resultados
  if (!laCategoria) return next();

  res.render("editarInhabilitarCategoria", {
    layout: "layout4",
    Accion: "Modifica tus categorias",
    laCategoria,
    elUsuario
  });
};

//controlador para guardar los datos
exports.editarCategoria = async (req, res) => {
  // obtenemos la categoria que se va a editar enviada por la url
  const categoriaModificada = req.body;

  // obtenemos el usuario actual
  const elUsuario = req.user;
  // agregamos el autor de la categoria
  categoriaModificada.registradoPor = elUsuario._id;
  const categoria = await Categoria.findOneAndUpdate(
    { url: req.params.url },
    categoriaModificada,
    {
      new: true,
      runValidators: true
    }
  );

  res.redirect("/categoria/listarCategoria");
};

//Controlador para inhabilitar una categoria
exports.inhabilitarCategoria = async (req, res) => {

  const categoriaModificada = req.body;
  // obtenemos el usuario actual
  const elUsuario = req.user;
  // agregamos el autor de la categoria
  categoriaModificada.registradoPor = elUsuario._id;
  categoriaModificada.estado = 0;
  const categoria = await Categoria.findOneAndUpdate(
    { url: req.params.url },
    categoriaModificada,
    {
      new: true,
      runValidators: true
    }
  );
  // enviamos la respuesta del servidor
  res.status(200).send("Categoria inhabilitada satifactoriamente");
};

//Controlador para habilitar una categoria
exports.habilitarcategoria = async (req, res) => {
  const categoriaModificada = req.body;
  // obtenemos el usuario actual
  const elUsuario = req.user;
  // agregamos el autor de la categoria
  categoriaModificada.registradoPor = elUsuario._id;
  categoriaModificada.estado = 1;
  const categoria = await Categoria.findOneAndUpdate(
    { url: req.params.url },
    categoriaModificada,
    {
      new: true,
      runValidators: true
    }
  );
  // enviamos la respuesta del servidor
  res.status(200).send("Categoria Habilitada satifactoriamente");
};
