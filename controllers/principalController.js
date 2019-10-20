const mongoose = require("mongoose");

exports.mostrarPrincipal = (req, res, next) => {
  res.render("principal", {
    tituloPagina: "Control de presupuestos"
  });
};

exports.mostrarDashUsuario = async (req, res, next) => {
  // obtenemos todas las categorias de presuuestos seleccionados
  res.render("dashUsuario", {
    tituloPagina: "área de control personal",
    layout: "layout3"
  });
};
