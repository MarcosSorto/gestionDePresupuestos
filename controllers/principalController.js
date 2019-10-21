const mongoose = require("mongoose");
const Perfil = mongoose.model("perfil");

exports.mostrarPrincipal = (req, res, next) => {
  res.render("principal", {
    tituloPagina: "Control de presupuestos"
  });
};

exports.mostrarDashUsuario = async (req, res, next) => {
  const elUsuario = req.user;
  res.render("dashUsuario", {
    tituloPagina: "área de control personal",
    layout: "layout3",
    elUsuario
  });
};
