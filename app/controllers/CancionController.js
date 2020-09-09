'use strict'

const Cancion = require('../models/Cancion');

function index(req, res) {
	Cancion.find({})
		.then(cancion => {
			if (cancion.length) return res.status(200).send(cancion);
			return res.status(204).send({message: 'NO CONTENT'});
		}).catch(error => res.status(500).send({error}));
}

function show(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.cancion) return res.status(404).send({message: 'NOT FOUND'});
	let cancion = req.body.cancion;
	return res.status(200).send({cancion});
}

function create(req,res){
	let cancion = new Cancion();

	let params = req.body;

	cancion.artista = params.artista;
	cancion.estilo = params.estilo;
	cancion.name = params.name;

			if(cancion.estilo != null && cancion.artista != null){

				cancion.save((err,cancionStored) => {
					if(err){
						res.status(500).send({message: err});
					}else{
						if(!cancionStored){
							res.status(404).send({message: 'No se ha registrado la cancion'});
						}else{
							res.json(cancionStored);
						}
					}
				});
			}else{
				res.status(200).send({message: 'Introduce todos los campos'});
			}
}

function update(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.cancion) res.status(404).send({message: 'NOT FOUND'});
	let cancion = req.body.cancion[0];
	cancion = Object.assign(cancion, req.body);
	cancion.save().then(cancion => res.status(200).send({message: 'UPDATED', cancion})).catch(error => res.status(500).send({error}));
}

function remove(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.cancion) return res.status(404).send({message: "NOT FOUND"});
	req.body.cancion[0].remove().then(cancion => res.status(200).send({message: "REMOVED", cancion})).catch(error => res.status(500).send({error}));
}

function findIdCancion(req, res, next) {
	let query = {};
	query['_id'] = req.params.value;
	Cancion.find(query).then(cancion => {
		if (!cancion.length) return next();
		req.body.cancion = cancion;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function findIdArtista(req, res, next) {
	let query = {};
	query['artista'] = req.params.value;
	Cancion.find(query).then(cancion => {
		if (!cancion.length) return next();
		req.body.cancion = cancion;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

module.exports = {
	index,
	show,
	create,
	update,
	remove,
	findIdCancion,
	findIdArtista
}
