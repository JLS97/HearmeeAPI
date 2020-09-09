'use strict'

const Oferta = require('../models/Oferta');
var busqueda = require('../services/busqueda');

function index(req, res) {
	let query = req.query;
	let search = query.search;
	let soloAprobadas = query.soloAprobadas;
	let queryFinal = {};
	let queryAnd = [];
	let queryOr = [];
	let page = query.page ? parseInt(query.page) : null;
	let limit = query.limit ? parseInt(query.limit) : null;
	let soloTotal = query.soloTotal;
	
	let propiedades = {};
	let tienePropiedades = false;

	let isQuerySearch = search != null && search.length > 0;
	if (isQuerySearch) {
		propiedades = busqueda.obtenerFiltros(search);
	} else {
		let qLocalidades = query["localidades"];
		let qEstilos = query["estilos"];
		let qTitulo = query["titulo"];
		let qSueldoMin = query["sueldoMin"];
		let qSueldoMax = query["sueldoMax"];
		let qInstrumentos = query["instrumentos"];
		let qIds = query["ids"];

		if (qLocalidades != null && qLocalidades.length > 0)
			propiedades.localidades = qLocalidades;
		if (qEstilos != null && qEstilos.length > 0)
			propiedades.estilosMusicales = qEstilos;
		if (qTitulo != null && qTitulo.length > 0)
			propiedades.titulo = qTitulo;
		if (qSueldoMin != null && qSueldoMin.length > 0)
			propiedades.sueldoMin = qSueldoMin;
		if (qSueldoMax != null && qSueldoMax.length > 0)
			propiedades.sueldoMax = qSueldoMax;
		if (qInstrumentos != null && qInstrumentos.length > 0)
			propiedades.instrumentos = qInstrumentos;
		if (qIds != null && qIds.length > 0)
			propiedades.ids = qIds;
	}

	let idsAux = propiedades.ids;
	if (idsAux) {
		tienePropiedades = true;
		let ids = [];
		if (Array.isArray(idsAux)){
			ids = idsAux;
		} else {
			ids[0] = idsAux;
		}

		let numIds = ids.length;
		let addIdsAlOR = (numIds > 1);
		ids.forEach(id => {
			let queryOpt = {"_id": id};
			if (isQuerySearch || addIdsAlOR)
				queryOr.push(queryOpt);
			else
				queryAnd.push(queryOpt);
		});
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

	let titulo = (isQuerySearch) ? propiedades.texto : propiedades.titulo;
	if (titulo != null && titulo.length > 0) {
		tienePropiedades = true;
		let tituloSeparado = titulo.split(" ");
		let tituloregex = "";
		tituloSeparado.forEach(texto => {
			if (texto.length > 2)
				tituloregex += texto + "|";
		});
		tituloregex = tituloregex.substring(0, tituloregex.length - 1);
		queryOr.push({"titulo": { $regex: tituloregex, $options: 'i'}});
	}
	let sueldoMin = propiedades.sueldoMin;
	if (sueldoMin != null && sueldoMax.length > 0) {
		tienePropiedades = true;
		queryAnd.push({"sueldo": { "$gte": sueldoMin }});
	}
	let sueldoMax = propiedades.sueldoMax;
	if (sueldoMax != null && sueldoMax.length > 0) {
		tienePropiedades = true;
		queryAnd.push({"sueldo": { "$lte": sueldoMax }});
	}

	if (soloAprobadas) {
		if (isQuerySearch) {
			queryFinal["$and"] = [{"aprobada": true}, {"$or": queryOr}];
		} else {
			if (queryAnd.length > 0) {
				if (queryOr.length > 0)
					queryAnd.push({"$or": queryOr});
		
				queryAnd.push({"aprobada": true});
				queryFinal["$and"] = queryAnd;
			} else if (queryOr.length > 0) {
				queryFinal["$and"] = [{"aprobada": true}, {"$or": queryOr}];
			}
		}
	} else {
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
	
	}
	

	let resTest = tienePropiedades ? queryFinal : {};

	if (!soloTotal) {
		if (!limit || !page) {
			Oferta.find(resTest).then(oferta => {
				if (tienePropiedades) {
					let result = { "ofertas": oferta, "filtros": propiedades};
					return res.status(200).send(result);
				} else {
					if (oferta.length) return res.status(200).send(oferta);
				}
		
				return res.status(204).send({message: 'NO CONTENT'});
			}).catch(error => res.status(500).send({error}));
		} else {
			Oferta.find(resTest).skip((page - 1) * limit).limit(limit).then(oferta => {
				if (tienePropiedades) {
					let result = { "ofertas": oferta, "filtros": propiedades};
					return res.status(200).send(result);
				} else {
					if (oferta.length) return res.status(200).send(oferta);
				}
		
				return res.status(204).send({message: 'NO CONTENT'});
			}).catch(error => res.status(500).send({error}));
		}
	} else {
		Oferta.find(resTest).count().then(count => {
			return res.status(200).send({"total": count});
		}).catch(error => res.status(500).send({error}));
	}
}

function show(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.oferta) return res.status(404).send({message: 'Oferta no encontrada'});
	let oferta = req.body.oferta;
	return res.status(200).send(oferta);
}


function createOferta(req,res){
	let oferta = new Oferta();

	let params = req.body;

	oferta.ciudad = params.ciudad;
	oferta.sueldo = params.sueldo;
	oferta.creador = params.creador;
	oferta.titulo = params.titulo;

			if(oferta.creador != null && oferta.sueldo != null){

				oferta.save((err,ofertaStored) => {
					if(err){
						res.status(500).send({message: err});
					}else{
						if(!ofertaStored){
							res.status(404).send({message: 'No se ha registrado la oferta'});
						}else{
							res.json(ofertaStored);
						}
					}
				});
			}else{
				res.status(200).send({message: 'Introduce todos los campos'});
			}
}

function updateOferta(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.oferta) res.status(404).send({message: 'Oferta no encontrada'});
	let oferta = req.body.oferta[0];
	oferta = Object.assign(oferta, req.body);
	oferta.save().then(oferta => res.status(200).send({message: 'UPDATED', oferta})).catch(error => res.status(500).send({error}));
}

function remove(req, res) {
	if (req.body.error) return res.status(500).send({error});
	if (!req.body.oferta) return res.status(404).send({message: "Oferta no encontrada"});
	req.body.oferta[0].remove().then(oferta => res.status(200).send({message: "REMOVED", oferta})).catch(error => res.status(500).send({error}));
}

function find(req, res, next) {
	let query = {};
	query['_id'] = req.params.value;
	Oferta.find(query).then(oferta => {
		if (!oferta.length) return next();
		req.body.oferta = oferta;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function findCiudad(req, res, next) {
	let query = {};
	query['ciudad'] = req.params.value;
	Oferta.find(query).then(oferta => {
		if (!oferta.length) return next();
		req.body.oferta = oferta;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function findGenero(req, res, next) {
	let query = {};
	query['estilo'] = req.params.value;
	Oferta.find(query).then(oferta => {
		if (!oferta.length) return next();
		req.body.oferta = oferta;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}


function findPorFiltros(req, res, next) {
	let query = req.query;
	let queryFinal = {};
	let ciudad = query["ciudad"];
	if (ciudad)
		queryFinal["ciudad"] = { $regex: new RegExp("^" + ciudad, "i") };
	let titulo = query["titulo"];
	if (titulo)
		queryFinal["titulo"] = { $regex: new RegExp("^" + titulo, "i") };
	let sueldo = query["sueldo"];
	if (sueldo)
		queryFinal["sueldo"] = { $regex: new RegExp("^" + sueldo, "i") };

	Oferta.find(queryFinal).then(oferta => {
		if (!oferta.length) return next();
		req.body.oferta = oferta;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}

function getEmpresa(req, res, next) {
	let query ={};
	query['creador'] = req.params.value;
	Oferta.find(query).then(oferta => {
		if(!oferta.length) return next();
		req.body.oferta = oferta;
		return next();
	}).catch(error => {
		req.body.error = error;
		next();
	});
}


module.exports = {
	index,
	show,
	createOferta,
	updateOferta,
	remove,
	find,
	getEmpresa,
	findCiudad,
	findGenero,
	findPorFiltros
}
