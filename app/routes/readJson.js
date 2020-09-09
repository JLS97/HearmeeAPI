'use strict'

const express = require('express');

const App = express();

const Router = express.Router();

App.use(express.json());
App.use(express.urlencoded({
    extended: true
}));


Router.get('/', (req, res) => {
    console.log("entra");
    /*let searchText = req.query.search;
    if (!searchText)
        return res.status(400).send({
            message: 'No se ha introducido ningún texto a buscar'
        });

    let filtros = obtenerFiltros(searchText);
    return res.status(200).send(filtros);*/
});

module.exports = Router;

/*function(leerFichero) {

}*/