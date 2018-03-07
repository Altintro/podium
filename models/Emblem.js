"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const emblemSchema = Schema({
    name: { type: String, default: "", index: { unique: true, required: true, dropDups: true }},
    sigil: { type: String, default: ""},
    description: { type: String, default: ""},
    requirements: { type: String, default: ""},
    users: [{ type: Schema.Types.ObjectId, ref :'User'}],
   
})

var Emblem = mongoose.model ('Emblem', emblemSchema)
module.exports = Emblem