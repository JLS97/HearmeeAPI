const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
   nombre: {
        type: String,
        unique: true,
        required: true
    },
    
    estilo: {
        type: String,
        required: true,
        enum: ['Pop','Rock']
    }/* 
    email: {
		type: String,
		required: true
	},
	token: {
		type: String,
	},
	instrumentos: {
		type: String
	},
	valoraciones: [
		{type: Number}
	],
	estilo: {
		type: String,
		enum: ['Pop', 'Rock', 'Salsa','Bachata','HardRock','Clasica']
	},
	nombre: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	ciudad: {
		type: String,
		required: true
	},
	foto: {
		type: String
	},
	fechaCreacion: {
		type: Date,
		default: Date.now()
	}*/
});

const Bot = mongoose.model('Bot',BotSchema);

module.exports = Bot;