'use strict'

const express = require('express');
const OfertaCtrl = require('../controllers/OfertaController');

const md_auth = require('../middlewares/authenticated');

const Router = express.Router();

//para la imagen
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artistas'});

	  //GET Basico con todas las ofertas
Router.get('/',OfertaCtrl.index)
	  //para filtrar las ofertas por ciudades
	  .get('/ciudad/:value',OfertaCtrl.findCiudad,OfertaCtrl.show)
	  //para filtrar por el estilo
	  .get('/genero/:value',OfertaCtrl.findGenero,OfertaCtrl.show)
	  // busca y filtra por parametros GET https://hearmee.ovh/api/ofertas/filtros?ciudad=Alicante
	  .get('/filtros', OfertaCtrl.findPorFiltros, OfertaCtrl.show)
	  //POST que crea una oferta
	  .post('/',md_auth.ensureAuth, OfertaCtrl.createOferta)
	  //PUT modifica una oferta, es necesario el de la empresa que crea la oferta token.
	  .put('/:value',md_auth.ensureAuth, OfertaCtrl.find, OfertaCtrl.updateOferta)
	  //DELETE borra una oferta pasandole el ID de la misma por url: DELETE https://hearmee.ovh/api/ofertas/2131233453 necesario el token 
	  .delete('/:value',md_auth.ensureAuth, OfertaCtrl.find, OfertaCtrl.remove)
	  //GET para obtener todas las ofertas que ha hecho una empresa en especifico, 
	  //le pasamos el ID de la empresa: GET https://hearmee.ovh/api/ofertas/123123342
	  .get('/:value',OfertaCtrl.getEmpresa,OfertaCtrl.show);

module.exports = Router;