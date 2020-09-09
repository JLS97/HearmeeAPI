'use strict'

const Valoracion = require('../models/Valoracion');

//librerias para obtener la imagen
const fs = require('fs');

//token jwt
var jwt = require('../services/jwt');

//funcion utilizada para GET /api/valoraciones que muestra todas las
function index(req, res) {
	Valoracion.find({})
		.then(valoraciones => {
			if (valoraciones.length) return res.status(200).send(valoraciones);
			return res.status(204).send({message: 'No existen valoraciones'});
		}).catch(error => res.status(500).send({error}));
}

//actualizamos por el id
function update(req,res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.valoraciones) res.status(404).send({message: 'Ups, esta valoracion no existe'});
	let valoracion = req.body.valoraciones[0];
	valoracion = Object.assign(valoracion, req.body);
	valoracion.save().then(valoracion => res.status(200).send({message: 'UPDATED', valoracion})).catch(error => res.status(500).send({error}));
}

function findArtista(req,res) {
    let query = {};
	query['destinatario'] = req.params.value;
	Valoracion.find(query).then(valoraciones => {
		if (!valoraciones.length) return next();
		req.body.valoraciones = valoraciones;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function findEmpresa(req,res) {
    let query = {};
	query['destinatario'] = req.params.value;
	Valoracion.find(query).then(valoraciones => {
		if (!valoraciones.length) return next();
		req.body.valoraciones = valoraciones;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function show(req,res) {
    if (req.body.error) return res.status(500).send({error});
	if (!req.body.valoraciones) return res.status(404).send({message: 'No hay ninguna valoracion.'});
	let valoraciones = req.body.valoraciones;
	return res.status(200).send(valoraciones);
}

function findId(req,res) {
    let query = {};
	query['id'] = req.params.value;
	Valoracion.find(query).then(valoraciones => {
		if (!valoraciones.length) return next();
		req.body.valoraciones = valoraciones;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function remove(req,res) {
    if (req.body.error) return res.status(500).send({error});
	if (!req.body.valoraciones) return res.status(404).send({message: "Ups, esta valoracion no existe"});
	req.body.valoraciones[0].remove().then(valoracion => res.status(200).send({message: "REMOVED", valoracion})).catch(error => res.status(500).send({error}));
}

//post que crea una valoracion
function valorar(req,res) {
    let valoracion = new Valoracion();

	let params = req.body;

    valoracion.comentario = params.comentario;
    valoracion.puntuacion = params.puntuacion;
    valoracion.destinatario = params.destinatario;
    valoracion.propietario = params.propietario;

		

	if(valoracion.puntuacion != null && valoracion.email != null && valoracion.propietario != null){
		//guardar el artista
		Valoracion.save((err,valoracionStored) => {
			if(err){
				res.status(500).send({message: err});
				}else{
					if(!valoracionStored){
						res.status(404).send({message: 'No se ha podido registrar la valoracion'});
					}else{
						res.json(valoracionStored);
					}
				}
			});
	}else{
		res.status(200).send({message: 'Introduce todos los campos'});
	}
}



module.exports = {
	index,
    findArtista,
    findEmpresa,
    show,
    update,
    findId,
    remove,
    valorar
}