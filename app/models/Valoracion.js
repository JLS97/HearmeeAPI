'use strict'

const mongoose = require('mongoose');

var Artista = mongoose.model('Artista');

var Empresa = mongoose.model('Empresa');

var Schema = mongoose.Schema;

const ValoracionSchema = new mongoose.Schema({
    comentario: {
        type: String
    },
    puntuacion: {
        type: Number,
        required: true
    },
    propietario: {
        type: Schema.ObjectId, ref: "Artista",
        required: true
    },
    destinatario: {
        type: Schema.ObjectId, ref:"Empresa",
        required: true
    }
});

const Valoracion = mongoose.model('Valoracion', ValoracionSchema);

module.exports = Valoracion
