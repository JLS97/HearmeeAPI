
'use strict'

const mongoose = require('mongoose');
const Artista = require('../models/Artista');
const Artistamongo = mongoose.model('Artista');

const Oferta = require('../models/Oferta');
const Ofertamongo = mongoose.model('Oferta');

function principal(req,res){
  var pIntent = req.body.queryResult.intent.displayName;
  var pAction = req.body.queryResult.action;

  console.log('Action' + pAction);
  switch(pAction){
    case 'buscar.musico.avanzado':
      var pResponse = buscomusico(req.body.queryResult.parameters);
      break;
    case 'listado.ofertas':
      var pResponse = listaroferta(req.body.queryResult.parameters);
      break;
  }
  var outString = JSON.stringify(pResponse);
  console.log('Out:' + outString);

  res.send(outString);
}

function listaroferta(req,res) {
let estilobuscar = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.estilo
 ? req.body.queryResult.parameters.estilo 
 : 'Unknown';

Ofertamongo.findOne({estilo:estilobuscar},function(err,next){
Ofertamongo.find(estilobuscar).then(ofertas => {
		if (!ofertas.length) return next();
		req.body.ofertas = ofertas;
		
		return next(ofertas);
	}).catch(error => {
		req.body.error = error;
		next();
	});
	return res.json({
		fulfillmentText: "ok",
    		fulfillmentMessages: [
			{
				"card":{
					"title": next.titulo,
          "subtitle": "ESTILO: Pop	CIUDAD: " + next.ciudad, //+ next.estilo,
         
					"buttons":[
						{
							"text":"Mostrar mas resultados en HearMee",
							"postback":"https://hearmee.ovh"
						}
					]
				}
			}
		]
  });
	return next(ofertas);
})
}

function buscomusico(req,res)
{
let estilobuscar = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.estilo
 ? req.body.queryResult.parameters.estilo 
 : 'Unknown';

Artistamongo.findOne({estilo:estilobuscar},function(err,next){
Artistamongo.find(estilobuscar).then(artistas => {
		if (!artistas.length) return next();
		req.body.artistas = artistas;
		
		return next(artistas);
	}).catch(error => {
		req.body.error = error;
		next();
	});
	return res.json({
		fulfillmentText: "ok",
    		fulfillmentMessages: [
			{
				"card":{
					"title": next.nombre,
					"subtitle": "Estilo: " + next.estilo,
					"imageUri": "",
					"buttons":[
						{
							"text":"Mostrar mas resultados en HearMee",
							"postback":"https://hearmee.ovh"
						}
					]
				}
			}
		]
              /*speech:next.nombre,
              displayText: 'Algo ha ido bien!',
              source: 'musico info'*/
          });
	return next(artistas);

})
}
      
/*
	{
        if (err)
        {
          return res.json({
              speech: 'Algo ha ido mal!',
              displayText: 'Algo ha ido mal!',
              source: 'musico info'
          });
        }
if (existe){
  return res.json({
    fulfillmentText: existe.nombre,
    fulfillmentMessages: [
      {
        "card":{
          "title":existe.nombre, 
          "subtitle": "Estilo:" + existe.estilo,
          "imageUri":"",
          "buttons": [
            {
              "text":"Para m s info haz click aqu ",
              "postback": "https://www.ua.es/"
            }
          ]
        }
      }
    ]
  });*/
    	/*out = {
    			fulfillmentText: existe.nombre,
    			fulfillmentMessages: null
    		};

    	var outString = JSON.stringify(out);
    	res.send(outString);
    	return res.json(
        out
      );*/
         /* return res.json({
                speech: existe.nombre,
                displayText: existe.estilo,
                source: 'musico info'
    });
}
        else {
          return res.json({
                speech: 'No hay informacion suficiente sobre lo que preguntas',
                displayText: 'No hay informacion suficiente sobre lo que preguntas',
                source: 'musico info'
            });
        }

      });
}

*/


/*
  let query = req.body.queryResult.parameters;
    let url = 'http://localhost:3000';
    console.log(query);

    request(url, function (error, response, body){
        let obj = JSON.parse(body);
        console.log(obj);

    })
    
    return res.json({

        "fulfillmentText": "holassss",
        "fulfillmentMessages": [
          {
            "text": {
              "text": ["holassss"]
            }
          }
        ],
        "source": "<webhookpn1>"
      
      
        });
      }
*/
module.exports = {
  
  buscomusico , listaroferta/*, principal,*/

}