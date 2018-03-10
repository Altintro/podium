"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const gameSchema = Schema({
    name: { type: String, default: "" },
    sport: { type: Schema.Types.ObjectId, ref: 'Sport' },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    wins: { type: Schema.Types.ObjectId, ref: 'Team' },
    loses: { type: Schema.Types.ObjectId, ref: 'Team' },
    concluded: { type: Boolean, default : false },
    date: { type: Date, default: Date.now() },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
})

var Game = mongoose.model ('Game', gameSchema)
module.exports = Game