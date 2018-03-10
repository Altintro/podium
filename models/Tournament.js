"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema
const tournamentSchema = Schema({
    name: { type: String, default: "", required: true, index: true },
    sport: { type : Schema.Types.ObjectId, ref : 'Sport'},
    compType: { type: String, default: "", required: true , index:true},
    participants:[{ type: Schema.Types.ObjectId, ref: 'Team'}],
    players: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    levelAverage: { type: String, default : "" },
    clasification: [{ type: Schema.Types.ObjectId, ref: 'Clasification'}],
    starts: { type: Date, default: Date.now() },
    finishes: { type: Date, default: Date.now() },
    longitude: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    open: { type: Boolean, default: true }
})

var Tournament = mongoose.model ('Tournament', tournamentSchema)
module.exports = Tournament