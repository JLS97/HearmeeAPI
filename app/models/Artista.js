'use strict'

const fs = require('fs');

const mongoose = require('mongoose');

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
	gethash: {
		type:Boolean
	}
});

const Artista = mongoose.model('Artista', ArtistaSchema);

module.exports = Artista
