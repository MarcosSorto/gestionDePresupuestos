const mongoose = require("mongoose");
const Perfil = mongoose.model("perfil");
const Presupuesto = mongoose.model("presupuesto");
const Categoria = mongoose.model("categoria");
exports.mostrarPrincipal = (req, res, next) => {
  res.render("principal", {
    tituloPagina: "Control de presupuestos"
  });
};

exports.mostrarDashUsuario = async (req, res, next) => {
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

  res.render("dashUsuario", {
    tituloPagina: "área de control personal",
    layout: "layout3",
    elUsuario,
    finanza,
    gasto,
    lasCategorias,
    losPresupuestos
  });
};
