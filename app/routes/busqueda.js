'use strict'

const express = require('express');
//const BusquedaCtrl = require('../controllers/ArtistaController');
const OfertaCtrl = require('../controllers/OfertaController');

const App = express();
const md_auth = require('../middlewares/authenticated');


const Router = express.Router();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));


Router.get('/', (req, res) => {
    let searchText = req.query.search;
    if (!searchText)
        return res.status(400).send({ message: 'No se ha introducido ningún texto a buscar'});

    let filtros = obtenerFiltros(searchText);
    return res.status(200).send(filtros);
})
/*.get('/ofertas', (req, res) => {
    let searchText = req.query.search;
    if (!searchText)
        return res.status(400).send({ message: 'No se ha introducido ningún texto a buscar'});

    let filtros = obtenerFiltros(searchText);
    let estilosMusicales = filtros.estilosMusicales;
    let localidades = filtros.localidades;
    let fechasInicio = filtros.fechasInicio;
    let instrumentos = filtros.instrumentos;
    let texto = filtros.texto;
    req.query.estilosMusicales = estilosMusicales;
    req.query.ciudad = localidades;
    req.query.fechasInicio = fechasInicio;
    req.query.instrumentos = instrumentos;
    OfertaCtrl.findPorFiltros(req, res);
    return res.status(200).send(filtros);
})*/;

module.exports = Router;

function obtenerFiltros(searchText) {    
    let filtros = {"estilosMusicales": [], "localidades": [], "fechasInicio": [], "instrumentos": [], "texto": searchText};
    let fechasInicio = ["hoy", "mañana", "ayer"];
    let instrumentosClave = new Map();
    instrumentosClave.set("guitarr", "Guitarra");
    instrumentosClave.set("trompe", "Trompeta");
    instrumentosClave.set("saxo", "Saxofón");
    instrumentosClave.set("violi", "Violín");
    instrumentosClave.set("flauti", "Flauta");
    instrumentosClave.set("vocali", "Voz");
    instrumentosClave.set("pian", "Piano");
    instrumentosClave.set("bajis", "Bajo");
    instrumentosClave.set("gait", "Gaita");
    instrumentosClave.set("xilo", "Xilófono");

    const fs = require('fs');

    let instrumentosJson = fs.readFileSync('/var/www/html/api/app/config/instrumentos.json');
    let instrumentos = JSON.parse(instrumentosJson);
    let localidadesJson = fs.readFileSync('/var/www/html/api/app/config/localidadesNombres.json');
    let localidades = JSON.parse(localidadesJson);
    let estilosMusicalesJson = fs.readFileSync('/var/www/html/api/app/config/estilos_musicales.json');
    let estilosMusicales = JSON.parse(estilosMusicalesJson);

    let palabras = searchText.split(" ");

    let localidadesSeleccionadas = [];
    let fechasInicioSeleccionadas = [];
    let instrumentosSeleccionados = [];
    let estilosMusicalesSeleccionados = [];
    palabras.forEach(palabra => {
        let palabraMinus = palabra.toLowerCase();
        let fechaInicioSel = fechasInicio.find(fechaInicio => palabraMinus === fechaInicio.toLowerCase() || palabraMinus.startsWith(fechaInicio.toLowerCase()));
        if (fechaInicioSel)
            fechasInicioSeleccionadas.push(fechaInicioSel);
        let instrumentoSel = instrumentos.find(instrumento => palabraMinus === instrumento.toLowerCase() || palabraMinus.startsWith(instrumento.toLowerCase()));
        if (instrumentoSel)
            instrumentosSeleccionados.push(instrumentoSel);
        else {
            instrumentosClave.forEach(function(valor, clave, instrumentosClave) {
                if (palabraMinus.startsWith(clave.toLowerCase()))
                    instrumentosSeleccionados.push(valor);
            });
        }
        let localidadSel = localidades.find(localidad => palabraMinus === localidad.toLowerCase() || palabraMinus.startsWith(localidad.toLowerCase()));
        if (localidadSel)
            localidadesSeleccionadas.push(localidadSel);
        let estiloMusicalSel = estilosMusicales.find(estiloMusical => palabraMinus === estiloMusical.toLowerCase() || palabraMinus.startsWith(estiloMusical.toLowerCase()));
        if (estiloMusicalSel)
            estilosMusicalesSeleccionados.push(estiloMusicalSel);
        
    });

    filtros.estilosMusicales = estilosMusicalesSeleccionados;
    filtros.localidades = localidadesSeleccionadas;
    filtros.fechasInicio = fechasInicioSeleccionadas;
    filtros.instrumentos = instrumentosSeleccionados;
    return filtros;
}