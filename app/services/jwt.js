'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_hearmee';

exports.createToken = function(artista){
    var payload = {
        sub: artista._id,
        nombre: artista.nombre,
        apellidos: artista.apellidos,
        email: artista.email,
        ciudad: artista.ciudad,
        pais: artista.pais,
        coidgoPostal: artista.coidgoPostal,
        foto: artista.foto,
        fechaCreacion: artista.fechaCreacion,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, secret);
};
