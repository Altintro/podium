'use_strict'

const mongoose = require('mongoose')
const conn = mongoose.connection
mongoose.Promise = global.Promise

//Establezco conexion con la base de datos
conn.on('error', err =>{
    console.log('conection error with dataBase:', err)
    process.exit(1)
})

conn.once('open', () => {
    console.log('Connected to MongoDb')
})

mongoose.connect('mongodb://localhost/podiumdb')