"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const emblemSchema = Schema({
    name: String,
    sigil: String,
    description: String,
    requirements: String,
    users: [{ type: Schema.Types.ObjectId, ref :'User'}],
   
})

var Emblem = mongoose.model ('Emblem', emblemSchema)
module.exports = Emblem