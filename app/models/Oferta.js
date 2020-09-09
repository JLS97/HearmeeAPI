'use strict'

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Artista = mongoose.model('Artista');

var Empresa = mongoose.model('Empresa');

const OfertaSchema = new mongoose.Schema({

    estilo: [
		{type: String}
	],

    ciudad: {
        type: String,
        required: true
	},
	
	sueldo: {
		type: String,
		required: true
	},

	fechaInicio: {
		type: Date,
		default: Date.now()
	},

	fechaFin: {
		type: Date
	},

	titulo: {
		type: String
	},

	descripcion: {
		type: String
	},

	foto: {
		type: String
	},


	instrumentos: [
		{type: String}
	],

	solicitantes: [
		{type: Schema.ObjectId, ref: "Artista"}
	],

	preselecion: [
		{type: Schema.ObjectId, ref:"Artista"}
	],

	creador: {
		type: Schema.ObjectId, ref: "Empresa",
		required: true
	}

});

const Oferta = mongoose.model('Oferta', OfertaSchema);

module.exports = Oferta
