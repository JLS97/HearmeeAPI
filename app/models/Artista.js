'use strict'

const fs = require('fs');
/*
let instrumentosJson = fs.readFileSync('./config/instrumentos.json');
let instrumentos = JSON.parse(instrumentosJson);
let localidadesJson = fs.readFileSync('./config/localidadesNombres.json');
let localidades = JSON.parse(localidadesJson);
let estilosMusicalesJson = fs.readFileSync('./config/estilos_musicales.json');
let estilosMusicales = JSON.parse(estilosMusicalesJson);
*/
const mongoose = require('mongoose');

//var Oferta = mongoose.model('Oferta');

const ArtistaSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	instrumentos: {
		type: String
	},
	estilo: {
		type: String
	},
	nombre: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	ciudad: {
		type: String
	},
	foto: {
		type: String
	},
	fechaCreacion: {
		type: Date,
		default: Date.now()
	},
	/*ofertasSolicitadas: [
		{type: Schema.ObjectId, ref:"Oferta"}
	],
	ofertasPasadas: [
		{type: Schema.ObjectId, ref:"Oferta"}
	],*/
	gethash: {
		type:Boolean
	}
});

const Artista = mongoose.model('Artista', ArtistaSchema);

module.exports = Artista
