'use strict'

const express = require('express');
const EmpresaCtrl = require('../controllers/EmpresaController');

const md_auth = require('../middlewares/authenticated');

const Router = express.Router();

Router.get('/', EmpresaCtrl.index) //muestra todas las empresas
	  .post('/', EmpresaCtrl.create) //se crea una empresa
	  //Las siguientes operaciones se filtran por el nombre
	  .get('/:value', EmpresaCtrl.find, EmpresaCtrl.show)
	  .put('/:value',md_auth.ensureAuth, EmpresaCtrl.find, EmpresaCtrl.update)
	  .delete('/:value',md_auth.ensureAuth, EmpresaCtrl.find, EmpresaCtrl.remove)

	  //Funcion no REST
	  .post('/login',EmpresaCtrl.login)

module.exports = Router;