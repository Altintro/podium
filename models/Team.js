"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const teamSchema = Schema({
    name: String,
    image: String,
    description: String,
    players: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

var Team = mongoose.model ('Team', teamSchema)
module.exports = Team