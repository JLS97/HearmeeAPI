'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_hearmee';

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message : 'La peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        var payload = jwt.decode(token, secret);

        //comprobamos que el token no ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'El token ha expirado'});
        }
    } catch (ex) {
        //console log porque no se que ocurre
        console.log(ex);
        //vale ya se que ocurre
        return res.status(404).send({message:'Token no valido'});        
    }

    req.artista = payload;

    next();
};