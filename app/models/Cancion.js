'use strict'

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Artista = mongoose.model('Artista');

const CancionSchema = new mongoose.Schema({
	
	name: {
		type: String,
		required: true
	},

	estilo: {
		type: String,
		required: true,
		enum: ['Blues','Jazz','Hip Hop','Rap','Indie','Pop', 'Rock', 'Salsa','Bachata','HardRock','Clasica']
	},

	artista : {
		type: Schema.ObjectId, ref: "Artista",
		required: true
	},

	ruta: {
		type: String
	},

	fechaCreacion: {
		type: Date,
		default: Date.now()
	},

});

const Cancion = mongoose.model('Cancion', CancionSchema);

module.exports = Cancion
