// definimos las instancias a utilizar.
const mongoose = require("mongoose");

//importamos la configuración de conexión a la base de datos
require("./config/db");

//configuración de handlebars cono template engine.
const express = require("express");
const exphbs = require("express-handlebars");

// utilizamos path para la definición de rutas
const path = require("path");

//Importar el módulo para subir archivos con express-fileUpload
const fileUpload = require("express-fileupload");

//importamos las rutas de nevagación
const router = require("./routes/index");
const cookieParser = require("cookie-parser");

// iportamos sessión para configuración de inicios de sesión
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("./config/passport");

// habilitamos el archivo de variables de entorno (variables.env)
require("dotenv").config({ path: "variables.env" });

const app = express();

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar Handlebars como Template Engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "layout",
    helpers: require("./helpers/handlebars")
  })
);

app.set("view engine", "handlebars");

// Definimos ruta para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//Habilitamos funcionalidad de fileUpload para la carga de archivos.
app.use(fileUpload());

// Creación de la sesión y de la cookie
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Implementar passport
app.use(passport.initialize());
app.use(passport.session());

// para los mensajes de alerta
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = flash.messages;
  next();
});

app.use("/", router());

app.listen(process.env.PORT);
