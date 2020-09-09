'use strict'

const Empresa = require('../models/Empresa');

//libreria para encriptar la contraseña
const bcrypt = require('bcrypt');

//librerias para obtener la imagen
const fs = require('fs');
const path = require('path');

//token jwt
var jwt = require('../services/jwt');

//funcion que muestra todo
function index(req, res) {
	Empresa.find({})
		.then(empresa => {
			if (empresa.length) return res.json(convertirEmpresas(empresa));
			return res.status(204).send({message: 'NO CONTENT'});
		}).catch(error => res.status(500).send({error}));
}
function convertirEmpresas(empresas) {
	let empresasRes = [];
	empresas.forEach(empresa => {
		let empresaAux = {
			"date": empresa.date,
			"_id": empresa._id,
			"nombre": empresa.nombre,
			"email": empresa.email,
			"ciudad": empresa.ciudad,
			"foto": empresa.foto
		};
		empresasRes.push(empresaAux);
	});
	return empresasRes;
}

//funcion para crear una empresa
function create(req,res){
	let empresa = new Empresa();

	let params = req.body;

	empresa.email = params.email;
	empresa.ciudad = 'null';
	empresa.foto = 'null';

	var salt = 10;
	if(params.password){
		//encriptar contraseña
		bcrypt.hash(params.password,salt, function(err,hash){
			empresa.password = hash;
			//res.status(200).send({message: artista.password});
			if(empresa.email != null && empresa.password != null){

				empresa.save((err,empresaStored) => {
					if(err){
						res.status(500).send({message: err});
					}else{
						if(!empresaStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.json(empresaStored);
						}
					}
				});
			}else{
				res.status(200).send({message: 'Introduce todos los campos'});
			}
		});
	}else{
		res.status(500).send({message: 'Introduce la contraseña'});
	}

}



//se busca una empresa por el nombre
function find(req, res, next) {
	let query = {};
	query['_id'] = req.params.value;
	Empresa.find(query).then(empresa => {
		if (!empresa.length) return next();
		req.body.empresa = empresa;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function login(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	Empresa.findOne({email: email.toLowerCase()}, (err,empresa) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion.'});
		}else{
			if(!empresa){
				res.status(404).send({message: 'La empresa no existe.'});
			}else{
				//comprobamos la contraseña
				bcrypt.compare(password,empresa.password,function(err,check){
					if(check){
						//devolver token jwt
						var token = jwt.createToken(empresa);
						res.status(200).send({message: token});
					}else{
						res.status(404).send({message: 'Ni puta idea de que cojones pasa.'});
					}
				});
			}
		}
	});
}



//se realiza alguna de estas tres operaciones con la emrpesa buscada por el nombre

/************************************************************************************/
function show(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.empresa) return res.status(404).send({message: 'NOT FOUND'});
	let empresa = req.body.empresa.nombre;
	return res.json(empresa);
}

function remove(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.products) return res.status(404).send({message: "NOT FOUND"});
	req.body.empresa[0].remove().then(empresa => res.status(200).send({message: "REMOVED", empresa})).catch(error => res.status(500).send({error}));
}

function update(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.empresa) res.status(404).send({message: 'NOT FOUND'});
	let empresa = req.body.empresa[0];
	empresa = Object.assign(empresa, req.body);
	empresa.save().then(empresa => res.status(200).send({message: 'UPDATED', empresa})).catch(error => res.status(500).send({error}));
}
/************************************************************************************/


module.exports = {
	index,
	show,
	create,
	update,
	remove,
	find,
	login
}
