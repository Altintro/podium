"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const sportSchema = Schema({
    name: {type : String, default : "" ,  index: { unique: true, required: true, dropDups: true }},
    image: { type: String, default: ""} ,
    description: { type: String, default: ""},
    rules: { type: String, default: ""},
    popularity: { type: Number, default: 0 },
    tournaments: [{type: Schema.Types.ObjectId, ref: 'Tournament'}],
    ranking: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

var Sport = mongoose.model ('Sport', sportSchema)
module.exports = Sport