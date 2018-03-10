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


var uri = 'mongodbb://' + config.dbuser + ':' + config.dbpass + '@localhost/' + config.db
//let uri = 'mongodb://localhost/' + config.db // Test in local db
mongoose.connect(uri)