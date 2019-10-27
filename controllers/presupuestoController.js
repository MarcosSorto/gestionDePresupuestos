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

  if (!losPresupuestos) return next();

  // suamos todos los gatso para hacer la relacion sueldo/costo
  var gasto = 0;
  for (c in losPresupuestos) {
    gasto += losPresupuestos[c].cantidad;
  }

  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 1
  });

  // obtenemos el % de ganancia o el % de pérdida
  var finanza = 0;
  const disponible = elUsuario.sueldo - gasto;
  if (disponible > 0) {
    finanza = "Ganancia";
  } else {
    finanza = "Pérdida";
  }
  const porcentaje = ((disponible / elUsuario.sueldo) * 100).toFixed(2);

  // mostramos la vista.
  res.render("listarPresupuesto", {
    losPresupuestos,
    titulo: "Control de presupuestos",
    elUsuario,
    layout: "layout3",
    lasCategorias,
    gasto,
    finanza,
    porcentaje
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

exports.formularioEditarPresupuesto = async (req, res) => {
  // obtenemos el usuario autenticado
  const elUsuario = req.user;

  // obtenemosl a categoria a editar mediante la url enviada en la dirección
  const elPresupuesto = await Presupuesto.findOne({ url: req.params.url });

  // Si no hay resultados
  if (!elPresupuesto) return next();

  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 1
  });

  // Si no existen categorias
  if (!lasCategorias) return next();

  res.render("editarEliminarPresupuesto", {
    layout: "layout4",
    Accion: "Modifica tus presupuestos",
    elPresupuesto,
    elUsuario,
    lasCategorias
  });
};
//controlador para guardar un presupuesto editado
exports.editarPresupuesto = async (req, res) => {
  //obtenemos el presupuesto editado
  const presupuestoModificado = req.body;

  //obtenemos el usuario
  const elUsuario = req.user;
  presupuestoModificado.registradoPor = elUsuario._id;

  //guardamos los cambios
  const presupuesto = await Presupuesto.findOneAndUpdate(
    { url: req.params.url },
    presupuestoModificado,
    {
      new: true,
      runValidators: true
    }
  );
  res.redirect("/categoria/listarCategoria");
};

// eliminar un presupuesto
exports.eliminarPresupuesto = async (req, res) => {
  // obtenemos  el id del presupuesto
  const { id } = req.params;

  // obtenemos el presupuesto a eliminar
  const presupuesto = await Presupuesto.findById(id);
  presupuesto.remove();
  // enviamos la respuesta del servidor
  res.status(200).send("Presupuesto eliminado satifactoriamente");
};

// opciones de filtrado para listar resultados de presupuesto
exports.busquedaPresupuesto = async (req, res, next) => {
  // obtenemos el usuario actualmente activo.
  const elUsuario = req.user;

  //verificamos que opciones de filtrado selecciona el usuario.
  const { fecha, categoria } = req.body;
  //buscamos por ambos criterios de búsqueda
  losPresupuestosCosto = await Presupuesto.find({
    registradoPor: elUsuario._id
  });

  //verificamos si el usuario filtrará por fecha, por categoria o si utiliza ambos criterios de filtrado
  var losPresupuestos;
  if (!fecha == "" && !categoria == "") {
    //buscamos por ambos criterios de búsqueda
    losPresupuestos = await Presupuesto.find({
      registradoPor: elUsuario._id,
      fecha: fecha,
      categoria: categoria
    });

    if (!losPresupuestos) return next();
  } else if (!fecha == "") {
    //buscamos solo por la fecha
    losPresupuestos = await Presupuesto.find({
      registradoPor: elUsuario._id,
      fecha: fecha
    });

    if (!losPresupuestos) return next();
  } else {
    //  buscamos solo por la categoria
    losPresupuestos = await Presupuesto.find({
      registradoPor: elUsuario._id,
      categoria: categoria
    });

    if (!losPresupuestos) return next();
  }

  // suamos todos los gatso para hacer la relacion sueldo/costo
  var gasto = 0;
  for (c in losPresupuestosCosto) {
    gasto += losPresupuestosCosto[c].cantidad;
  }

  const lasCategorias = await Categoria.find({
    registradoPor: elUsuario._id,
    estado: 1
  });

  // obtenemos el % de ganancia o el % de pérdida
  var finanza = 0;
  const disponible = elUsuario.sueldo - gasto;
  if (disponible > 0) {
    finanza = "Ganancia";
  } else {
    finanza = "Pérdida";
  }
  const porcentaje = ((disponible / elUsuario.sueldo) * 100).toFixed(2);

  // mostramos la vista.
  res.render("listarPresupuesto", {
    losPresupuestos,
    titulo: "Control de presupuestos",
    elUsuario,
    layout: "layout3",
    lasCategorias,
    gasto,
    finanza,
    porcentaje
  });
};
