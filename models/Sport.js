"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const sportSchema = Schema({
    name: String,
    image: String,
    description: String,
    rules: String,
    popularity: Number,
    sides: String,
    tournaments: [{type: Schema.Types.ObjectId, ref: 'Tournament'}],
    ranking: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

var Sport = mongoose.model ('Sport', sportSchema)
module.exports = Sport