'use strict'

const express = require('express');
const ValoracionCtrl = require('../controllers/ValoracionController');

const md_auth = require('../middlewares/authenticated');

const Router = express.Router();


Router.get('/',ValoracionCtrl.index)
        //Todas las valoraciones de un artista, pasandole el ID del  artista: https://hearmee.ovh/api/valoraciones/artistas/12314332654645
      .get('/artista/:value', ValoracionCtrl.findArtista, ValoracionCtrl.show)
        //Todas las valoraciones de una empresa, pasandole el ID de la empresa: https://hearmee.ovh/api/valoraciones/empresas/123435345123153
      .get('/emrpesa/:value', ValoracionCtrl.findEmpresa, ValoracionCtrl.show)
        //Valoracion especifica pasandole el id de la valoracion: https://hearmee.ovh/api/valoraciones/123151545313421
      .put('/:value',md_auth.ensureAuth,ValoracionCtrl.findId, ValoracionCtrl.update)
        //Borramos una valoracion en concreto pasandole el ID de la valoracion: https://hearmee.ovh/api/valoraciones/12343261947632412
      .delete('/:value',md_auth.ensureAuth, ValoracionCtrl.findId, ValoracionCtrl.remove)
        //Publicamos una valoracion, para ello necesitamos el token de autorizacion
	    .post('/',md_auth.ensureAuth,ValoracionCtrl.valorar);

module.exports = Router;
