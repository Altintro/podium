"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const sportSchema = Schema({
    name: {type : String, default : "", required: true,  index: { unique: true, dropDups: true }},
    image: { type: String, default: ""} ,
    description: { type: String, default: ""},
    rules: { type: String, default: ""},
    popularity: Number,
    modality: { type: String, default: "individual" },
    tournaments: [{type: Schema.Types.ObjectId, ref: 'Tournament'}],
    ranking: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

var Sport = mongoose.model ('Sport', sportSchema)
module.exports = Sport