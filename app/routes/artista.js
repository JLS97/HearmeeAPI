
'use strict'

const express = require('express');
const ArtistaCtrl = require('../controllers/ArtistaController');

const App = express();
const md_auth = require('../middlewares/authenticated');

const Router = express.Router();
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/artistas')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage });

App.use(express.json());
App.use(express.urlencoded({ extended: true }));


//para la imagen
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artistas'});

Router.get('/',ArtistaCtrl.index) //te muestra todos los artistas GET https://hearmee.ovh/api/artistas
	  //.post('/login', ArtistaCtrl.loginUser)
	  .post('/', ArtistaCtrl.createUser) //das de alta un usuario POST https://hearmee.ovh/api/artistas
	  // te muestra los datos de un artista especifico, filtra por email GET https://hearmee.ovh/api/artistas/email/juan@gmail.com
	  .get('/nombre/:value', ArtistaCtrl.findNombre, ArtistaCtrl.show)
	  // busca y filtra por genero GET https://hearmee.ovh/api/artistas/genero/Pop
	  .get('/genero/:value', ArtistaCtrl.findGenero, ArtistaCtrl.show)
	  // busca y filtra por ciudad GET https://hearmee.ovh/api/artistas/ciudad/Alicante
	  .get('/ciudad/:value', ArtistaCtrl.findCiudad, ArtistaCtrl.show)
	  // busca y filtra por parametros GET https://hearmee.ovh/api/artistas/filtros?ciudad=Alicante&genero=pop
	  .get('/filtros', ArtistaCtrl.findPorFiltros, ArtistaCtrl.show)
	  //actualiza los datos de un artista especifico, filtra por email PUT https://hearmee.ovh/juan@gmail.com
	  //esta accion requiere de un token de autentificación
	  .put('/:value',md_auth.ensureAuth, ArtistaCtrl.findNombre,ArtistaCtrl.update)
	  //elimina un usuario, filtra por el email DELETE https://hearmee.ovh/api/juan@gmail.com
	  //esta accion requiere de un token de autentificacion 
	  .delete('/:value',md_auth.ensureAuth, ArtistaCtrl.findNombre, ArtistaCtrl.remove)

	  //Funcion no REST	
	  .post('/login',ArtistaCtrl.login)

	  .post('/subirimagen/:id',md_upload,ArtistaCtrl.subirImagen)
	  .post('/subirImagenMulter/:id', upload.single('file'), ArtistaCtrl.subirImagenMulter)

	  .get('/getImagen',ArtistaCtrl.getImagen)

module.exports = Router;
