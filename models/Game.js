"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const gameSchema = Schema({
    name: { type: String, default: '' },
    sport: { type: Schema.Types.ObjectId, ref: 'Sport' },
    description: { type: String, default: '' },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    participants:[{ type: Schema.Types.ObjectId, ref: 'User'}],
    wins: { type: Schema.Types.ObjectId, ref: 'Team' },
    loses: { type: Schema.Types.ObjectId, ref: 'Team' },
    open: {type: Boolean, default: true, index: true },
    concluded: { type: Boolean, default : false },
    date: { type: Date, default: Date.now() },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    modality: { type: String, default: 'individual' },
    levelAverage: { type: String, default: '' }
})

var Game = mongoose.model ('Game', gameSchema)
module.exports = Game