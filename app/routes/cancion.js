'use strict'

const express = require('express');
const CancionCtrl = require('../controllers/CancionController');

const md_auth = require('../middlewares/authenticated');

const Router = express.Router();

Router.get('/', CancionCtrl.index)
	  //Creamos una cancion
	  .post('/',md_auth.ensureAuth, CancionCtrl.create)
	  //Todas las canciones de un artista pasandole el ID del artista
	  .get('/:value', CancionCtrl.findIdArtista, CancionCtrl.show)
	  //Modificamos una cancion pasandole el ID de la cancion
	  .put('/:value',md_auth.ensureAuth, CancionCtrl.findIdCancion, CancionCtrl.update)
	  //Borramos una cancion pasandole el ID de la cancion
	  .delete('/:value',md_auth.ensureAuth, CancionCtrl.findIdCancion, CancionCtrl.remove);

module.exports = Router;
