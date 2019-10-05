// definimos las instancias a utilizar.
const mongoose = require('mongoose');
const express = require('express');


// habilitamos el archivo de variables de entorno (variables.env)
require('dotenv').config({path: 'variables.env'});

const app = express();


app.listen(process.env.PORT);