'use strict'


exports.obtenerFiltros = function(searchText){
    let filtros = {"estilosMusicales": [], "localidades": [], "fechasInicio": [], "instrumentos": [], "texto": searchText};
    let fechasInicio = ["hoy", "mañana", "ayer"];
    let instrumentosClave = new Map();
    instrumentosClave.set("guitarr", "Guitarra");
    instrumentosClave.set("trompe", "Trompeta");
    instrumentosClave.set("saxo", "Saxofón");
    instrumentosClave.set("violi", "Violín");
    instrumentosClave.set("flauti", "Flauta");
    instrumentosClave.set("vocali", "Voz");
    instrumentosClave.set("pian", "Piano");
    instrumentosClave.set("bajis", "Bajo");
    instrumentosClave.set("gait", "Gaita");
    instrumentosClave.set("xilo", "Xilófono");

    const fs = require('fs');

    let instrumentosJson = fs.readFileSync('/var/www/html/api/app/config/instrumentos.json');
    let instrumentos = JSON.parse(instrumentosJson);
    let localidadesJson = fs.readFileSync('/var/www/html/api/app/config/localidadesNombres.json');
    let localidades = JSON.parse(localidadesJson);
    let estilosMusicalesJson = fs.readFileSync('/var/www/html/api/app/config/estilos_musicales.json');
    let estilosMusicales = JSON.parse(estilosMusicalesJson);

    let palabras = searchText.split(" ");

    let localidadesSeleccionadas = [];
    let fechasInicioSeleccionadas = [];
    let instrumentosSeleccionados = [];
    let estilosMusicalesSeleccionados = [];

    
    palabras.forEach(function(palabra, index, object) {
        let palabraSeleccionada = false;
        let palabraMinus = palabra.toLowerCase();
        /*let fechaInicioSel = fechasInicio.find(fechaInicio => palabraMinus === fechaInicio.toLowerCase() || palabraMinus.startsWith(fechaInicio.toLowerCase()));
        if (fechaInicioSel) {
            fechasInicioSeleccionadas.push(fechaInicioSel);
            object.splice(index, 1);
        }*/
        let instrumentoSel = instrumentos.find(instrumento => palabraMinus === instrumento.toLowerCase() || palabraMinus.startsWith(instrumento.toLowerCase()));
        if (instrumentoSel) {
            instrumentosSeleccionados.push(instrumentoSel);
            object.splice(index, 1);
            palabraSeleccionada = true;
        } else {
            instrumentosClave.forEach(function(valor, clave, instrumentosClave) {
                if (palabraMinus.startsWith(clave.toLowerCase())) {
                    instrumentosSeleccionados.push(valor);
                    object.splice(index, 1);
                    palabraSeleccionada = true;
                }
            });
        }

        /*if (palabraMinus.length >= 3) {
            localidades.forEach(localidad => { 
                let localidadMinus = localidad.toLowerCase();

                let localidadSeparada = localidadMinus.split(" ");
                localidadSeparada.forEach(palabra => {
                    palabra = palabra.replace(",", "");
                    if (palabra.startsWith(palabraMinus)){
                        localidadesSeleccionadas.push(localidad);
                        return;
                    }
                });
                /*if (localidadMinus.startsWith(palabraMinus)){
                    localidadesSeleccionadas.push(localidad);
                }*-/
            });
        }*/
        
        if (!palabraSeleccionada) {
            let estiloMusicalSel = estilosMusicales.find(estiloMusical => palabraMinus === estiloMusical.toLowerCase() || palabraMinus.startsWith(estiloMusical.toLowerCase()));
            if (estiloMusicalSel) {
                estilosMusicalesSeleccionados.push(estiloMusicalSel);
                object.splice(index, 1);
            }
        }
        
    });

    if (estilosMusicalesSeleccionados != null && estilosMusicalesSeleccionados.length > 0)
        filtros.estilosMusicales = estilosMusicalesSeleccionados;
    if (localidadesSeleccionadas != null && localidadesSeleccionadas.length > 0)
        filtros.localidades = localidadesSeleccionadas;
    if (fechasInicioSeleccionadas != null && fechasInicioSeleccionadas.length > 0)
        filtros.fechasInicio = fechasInicioSeleccionadas;
    if (instrumentosSeleccionados != null && instrumentosSeleccionados.length > 0)
        filtros.instrumentos = instrumentosSeleccionados;

    return filtros;
};