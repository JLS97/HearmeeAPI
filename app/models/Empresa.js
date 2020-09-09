'use strict'

const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({

	email: {
		type : String,
		unique: true,
		required: true
	},

	nombre: {
		type: String,
	},

	password: {
		type: String,
		required: true
	},

	ciudad: {
		type: String
	},

	direccion: {
		type: String
	},

	foto: {
		type: String

	},

	token: {
		type: String,
		unique: true
	},

	descripcion: {
		type: String
	},

	date: {
		type: Date,
		default: Date.now()
	}

});

const Empresa = mongoose.model('Empresa', EmpresaSchema);

module.exports = Empresa