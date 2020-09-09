const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const App = express();

const Artista = require('./routes/artista');
const Cancion = require('./routes/cancion');
const Empresa = require('./routes/empresa');
const Oferta = require('./routes/oferta');
const Valoracion = require('./routes/valoracion');
const Bot = require('./routes/bot');
const Busqueda = require('./routes/busqueda');
const ReadJson = require('./routes/readJson');

App.use(bodyParser.urlencoded({ extended: false }));
App.use(bodyParser.json());



//configurar cors
App.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

App.use("/artistas", Artista);
App.use("/canciones", Cancion);
App.use("/empresas", Empresa);
App.use("/ofertas", Oferta);
App.use("/valoraciones", Valoracion);
App.use("/bot", Bot);
App.use("/busqueda", Busqueda);
App.use("/readjson", ReadJson);



module.exports = App;