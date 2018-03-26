'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

//Establezco la libreria de promesas que vamos a usar
mongoose.Promise = global.Promise;

//Agrego un listener para escuchar posibles errores de conexión a la base de datos
conn.on('error', err => {    
    console.log('Error de conexión', err);
    process.exit(1);  //Cierro la aplicación porque no puedo usar la app sin la db
});

mongoose.connect('mongodb://localhost/podiumdb');