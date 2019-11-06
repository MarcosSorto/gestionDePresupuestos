const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Usuario = mongoose.model("perfil");

// Configurar la estrategia a utilizar
passport.use(
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "password"
    },
    async (correo, password, done) => {
      const usuario = await Usuario.findOne({ correo });

      //  verificamos si no esiste el usuario
      if (!usuario) {
        return done(null, false, {
          messages: ["El correo electrónico no es válido, !revisa!"]
        });
      }

      // si existe el usuario y verificamos la contraseña
      const verificarPassword = usuario.compararPassword(password);

      //   contraseña es incorrecta
      if (!verificarPassword) {
        return done(null, false, {
          messages: ["La contraseña es incorrecta"]
        });
      }

      //  El usuario existe y la contraseña es correcta
      return done(null, usuario);
    }
  )
);

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id).exec();

  return done(null, usuario);
});

module.exports = passport;
