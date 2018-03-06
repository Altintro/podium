'use_strict'

const mongoose = require('mongoose')
const conn = mongoose.connection
mongoose.Promise = global.Promise

//Stablish connection with database
conn.on('error', err =>{
    console.log('Conection error with dataBase:', err)
    process.exit(1)
})

conn.once('open', () => {
    console.log('Connected to MongoDb')
})

let uri = 'mongodb://localhost/podiumdb'
let options = { user: "podiumAdmin",
                password: "PodiumAltintro"}
// mongoose.connect('mongodb://localhost/podiumdb')
mongoose.connect(uri,options)