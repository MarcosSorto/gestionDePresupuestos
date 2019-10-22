const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

//configurando mongoose
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", error => {
  console.log(error);
});

// importamos los modelos
require("../models/Perfil");
require("../models/Categoria");
