"use_strict";

const mongoose = require('mongoose')
var config = require('../config')
const conn = mongoose.connection

mongoose.Promise = global.Promise

conn.on('error', err =>{
    console.log('Database connection error', err)
    process.exit(1)
})

conn.once('open', () => {
    console.log('Connected to MongoDB')
})

var uri = 'mongodb://' + config.dbuser + ':' + config.dbpass + '@localhost/' + config.db
//let uri = 'mongodb://localhost/' + config.db // Test in local db
mongoose.connect(uri)