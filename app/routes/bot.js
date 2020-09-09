'use strict'

const express = require('express');
const BotCtrl = require('../controllers/BotController');


const Router = express.Router();

Router .post('/',BotCtrl.buscomusico);
//Router .post('/',BotCtrl.listaroferta);

module.exports = Router;