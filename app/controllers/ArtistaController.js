'use strict'

const Artista = require('../models/Artista');
var busqueda = require('../services/busqueda');

//libreria para encriptar la contraseña
const bcrypt = require('bcrypt');

//librerias para obtener la imagen
const fs = require('fs');
const path = require('path');

//token jwt
var jwt = require('../services/jwt');


//creamos el usuario mediante el POST /api/artistas y pasandole los parametros por el body
function createUser(req,res){
	let artista = new Artista();

	let params = req.body;
	
	artista.nombre = params.email;
	artista.email = params.email;
	artista.pais = params.pais;
	artista.ciudad = params.ciudad;
	artista.foto = 'null';
	artista.codigoPostal = params.codigoPostal;
	artista.fechaCreacion = params.fechaCreacion;
	artista.instrumentos = 'null';
	artista.genero = params.estilo;
	//artista.password = params.password;
	var salt = 10;
	if(params.password){
		//encriptar contraseña
		bcrypt.hash(params.password,salt, function(err,hash){
			artista.password = hash;
			//res.status(200).send({message: artista.password});
			if(artista.nombre != null && artista.email != null){
				//guardar el artista
				artista.save((err,artistaStored) => {
					if(err){
						res.status(500).send({message: err});
					}else{
						if(!artistaStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send(artistaStored);
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



function login(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;
	var gethash = params.gethash;

	Artista.findOne({email: email.toLowerCase()}, (err,artista) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion.'});
		}else{
			if(!artista){
				res.status(500).send({message: 'El usuario no existe.'});
			}else{
				//comprobamos la contraseña
				bcrypt.compare(password,artista.password,function(err,check){
					if(check){
						//devolver token jwt
						if(gethash==true){
							var token = jwt.createToken(artista);
							res.status(200).send(token);
						}else{
							res.status(200).send(artista);
						}
					}else{
						res.status(404).send('Credenciales incorrectas');
					}
				});
			}
		}
	});
}

function subirImagen(req,res){
	var artistaId = req.params.id;
	var file_name = 'No subido ...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		console.log(file_split);
		console.log(file_name);

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg'){
			
			Artista.findByIdAndUpdate(artistaId, {foto: file_name},(err,artistaUpdated) => {
				if(!artistaUpdated){
					res.status(403).send({message : 'El usuario no ha podido modificar la imagen.'});
				}else {
					res.status(200).send({artista: artistaUpdated});
				}
			});

		}else{
			res.status(500).send({message: 'Extension de archivo no valida'});
		}


	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}

}

function subirImagenMulter(req, res) {
	/* 
	var artistaId = req.params.id;
	var file_name = 'No subido ...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		console.log(file_split);
		console.log(file_name);

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg'){
			
			Artista.findByIdAndUpdate(artistaId, {foto: file_name},(err,artistaUpdated) => {
				if(!artistaUpdated){
					res.status(403).send({message : 'El usuario no ha podido modificar la imagen.'});
				}else {
					res.status(200).send({artista: artistaUpdated});
				}
			});

		}else{
			res.status(500).send({message: 'Extension de archivo no valida'});
		}


	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	} */



	return res.send(req.file);
}

function getImagen(req,res){
	var imageFile = req.params.imageFile;
	//var path_file = './uploads/artistas' + imageFile;

	var path_file = './uploads/artistas/artista1.png';

	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(500).send({message : 'No existe la imagen'});
		}
	});
}

//funcion utilizada para GET /api/artistas que muestra todos los artistas
function index(req, res) {
	let query = req.query;
	let search = query.search;
	let queryFinal = {};
	let queryAnd= [];
	let queryOr= [];
	let soloTotal = query.soloTotal;

	let page = query.page ? parseInt(query.page) : null;
	let limit = query.limit ? parseInt(query.limit) : null;

	let propiedades = {};
	let tienePropiedades = false;

	let isQuerySearch = search != null && search.length > 0;
	if (isQuerySearch) {
		propiedades = busqueda.obtenerFiltros(search);
	} else {
		let qLocalidades = query["localidades"];
		let qEstilos = query["estilos"];
		let qNombre = query["nombre"];
		let qInstrumentos = query["instrumentos"];

		if (qLocalidades != null && qLocalidades.length > 0)
			propiedades.localidades = qLocalidades;
		if (qEstilos != null && qEstilos.length > 0)
			propiedades.estilosMusicales = qEstilos;
		if (qNombre != null && qNombre.length > 0)
			propiedades.nombre = qNombre;
		if (qInstrumentos != null && qInstrumentos.length > 0)
			propiedades.instrumentos = qInstrumentos;
	}

	let localidadesAux = propiedades.localidades;
	if (localidadesAux) {
		tienePropiedades = true;
		let localidades = [];
		if (Array.isArray(localidadesAux)){
			localidades = localidadesAux;
		} else {
			localidades[0] = localidadesAux;
		}

		let numLocalidades = localidades.length;
		let addLocalidadesAlOR = (numLocalidades > 1);
		localidades.forEach(localidad => {
			let queryOpt = {"ciudad": {"$regex": new RegExp("^" + localidad, "i")}};
			if (isQuerySearch || addLocalidadesAlOR)
				queryOr.push(queryOpt);
			else
				queryAnd.push(queryOpt);
		});
	}

	let estilosMusicalesAux = propiedades.estilosMusicales;	
	if (estilosMusicalesAux) {
		tienePropiedades = true;
		let estilosMusicales = [];
		if (Array.isArray(estilosMusicalesAux)) {
			estilosMusicales = estilosMusicalesAux;
		} else {
			estilosMusicales[0] = estilosMusicalesAux;
		}

		let numEstilos = estilosMusicales.length;
		let addEstilosAlOR = (numEstilos > 1);
		estilosMusicales.forEach(estilo => {
			let queryOpt = {"estilo": {"$regex": new RegExp("^" + estilo, "i")}};
			if (isQuerySearch || addEstilosAlOR)
				queryOr.push(queryOpt);
			else
				queryAnd.push(queryOpt);
		});
	}

	let instrumentosAux = propiedades.instrumentos;
	if (instrumentosAux) {
		tienePropiedades = true;
		let instrumentos = [];
		if (Array.isArray(instrumentosAux)) {
			instrumentos = instrumentosAux;
		} else {
			instrumentos[0] = instrumentosAux;
		}

		let numInstrumentos = instrumentos.length;
		let addInstrumentosAlOR = (numInstrumentos > 1);
		instrumentos.forEach(instrumento => {
			let queryOpt = {"instrumentos": {"$regex": new RegExp("^" + instrumento, "i")}};
			if (isQuerySearch || addInstrumentosAlOR)
				queryOr.push(queryOpt);
			else
				queryAnd.push(queryOpt);
		});
	}
	
	let nombre = (isQuerySearch) ? propiedades.texto : propiedades.nombre;
	if (nombre != null && nombre.length > 0) {
		tienePropiedades = true;
		let nombreSeparado = nombre.split(" ");
		let nombreregex = "";
		nombreSeparado.forEach(texto => {
			if (texto.length > 2)
			nombreregex += texto + "|";
		});
		nombreregex = nombreregex.substring(0, nombreregex.length - 1);
		queryOr.push({"nombre": { $regex: nombreregex, $options: 'i'}});
	}


	if (isQuerySearch) {
		queryFinal["$or"] = queryOr;
	} else {
		if (queryAnd.length > 0) {
			if (queryOr.length > 0)
				queryAnd.push({"$or": queryOr});
	
			queryFinal["$and"] = queryAnd;
		} else if (queryOr.length > 0) {
			queryFinal["$or"] = queryOr;
		}
	}

	let resTest = tienePropiedades ? queryFinal : {};
	
	if (!soloTotal) {
		if (!limit || !page) {
			Artista.find(resTest).then(artistas => {
				let artistasConvertidos = convertirArtistas(artistas);
				if (tienePropiedades) {

					let result = { "artistas": artistasConvertidos, "filtros": propiedades};
					return res.status(200).send(result);
				} else {
					if (artistas.length) return res.status(200).send(artistasConvertidos);
				}
		
				return res.status(204).send({message: 'NO CONTENT'});
			}).catch(error => res.status(500).send({error}));
		} else {
			Artista.find(resTest).skip((page - 1) * limit).limit(limit).then(artistas => {
				let artistasConvertidos = convertirArtistas(artistas);
				if (tienePropiedades) {
					let result = { "artistas": artistasConvertidos, "filtros": propiedades};
					return res.status(200).send(result);
				} else {
					if (artistas.length) return res.status(200).send(artistasConvertidos);
				}
		
				return res.status(204).send({message: 'NO CONTENT'});
			}).catch(error => res.status(500).send({error}));
		}
	} else {
		Artista.find(resTest).count().then(count => {
			return res.status(200).send({"total": count});
		}).catch(error => res.status(500).send({error}));
	}
}

function convertirArtistas(artistas) {
	let artistasRes = [];
	artistas.forEach(artista => {
		let artistaAux = {
			"solicitadas": artista.solicitadas,
			"aceptadas": artista.aceptadas,
			"fechaCreacion": artista.fechaCreacion,
			"_id": artista._id,
			"nombre": artista.nombre,
			"email": artista.email,
			"ciudad": artista.ciudad,
			"estilo": artista.estilo,
			"foto": artista.foto,
			"instrumentos": artista.instrumentos,
		};
		artistasRes.push(artistaAux);
	});
	return artistasRes;
}

//buscamos por el id
//este filtrado por id se usara para listar toda la infromacion de un usuario o para borrarlo posteriormente
function findNombre(req, res, next) {
	let query = {};
	query['_id'] = req.params.value;
	Artista.find(query).then(artistas => {
		if (!artistas.length) return next();
		req.body.artistas = artistas;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

//este filtrado por genero se usara para listar toda la infromacion de un usuario o para borrarlo posteriormente
function findGenero(req, res, next) {
	let query = {};
	query['estilo'] = req.params.value;
	Artista.find(query).then(artistas => {
		if (!artistas.length) return next();
		req.body.artistas = artistas;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function findPorFiltros(req, res, next) {
	let query = req.query;
	let queryFinal = {};
	let nombre = query["nombre"];
	if (nombre)
		queryFinal["nombre"] = { $regex: new RegExp("^" + nombre, "i") };
	let ciudad = query["ciudad"];
	if (ciudad)
		queryFinal["ciudad"] = { $regex: new RegExp("^" + ciudad, "i") };
	let instrumentos = query["instrumentos"];
	if (instrumentos)
		queryFinal["instrumentos"] = { $regex: new RegExp("^" + instrumentos, "i") };

	Artista.find(queryFinal).then(artistas => {
		if (!artistas.length) return next();
		req.body.artistas = artistas;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

//este filtrado por ciudad
function findCiudad(req, res, next) {
	let query = {};
	query['ciudad'] = req.params.value;
	Artista.find(query).then(artistas => {
		if (!artistas.length) return next();
		req.body.artistas = artistas;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

//actualizamos por el nombre
function update(req,res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.artistas) res.status(404).send({message: 'Ups, este artista no existe'});
	let artista = req.body.artistas[0];
	artista = Object.assign(artista, req.body);
	artista.save().then(artista => res.status(200).send({message: 'UPDATED', artista})).catch(error => res.status(500).send({error}));
}

//eliminamos por el nombre
function remove(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.artistas) return res.status(404).send({message: "Ups, este artista no existe"});
	req.body.artistas[0].remove().then(artista => res.status(200).send({message: "REMOVED", artista})).catch(error => res.status(500).send({error}));
}

//mostramos por el nombre
function show(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.artistas) return res.status(404).send({message: 'No hay ningun artista que coincida con esos parametros'});
	let artistas = req.body.artistas;
	return res.status(200).send(artistas);
}

module.exports = {
	index,
	show,
	update,
	remove,
	findGenero,
	findNombre,
	createUser,
	subirImagen,
	subirImageMulter,
	getImagen,
	login,
	findCiudad,
	findPorFiltros
} 
