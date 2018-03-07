"use_strict";

const mongoose = require('mongoose')
const conn = mongoose.connection

mongoose.Promise = global.Promise

conn.on('error', err =>{
    console.log('Database connection error', err)
    process.exit(1)
})

conn.once('open', () => {
    console.log('Connected to MongoDB')
})

mongoose.connect('mongodb://podiumAdmin:PodiumAltintro@localhost/podiumdb')