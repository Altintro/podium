"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const teamSchema = Schema({
    name: { type: String, default: "", index: { unique: true } },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    players: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

var Team = mongoose.model ('Team', teamSchema)
module.exports = Team