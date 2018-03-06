"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema
const tournamentSchema = Schema({
    name: { type: String, default: "", required: true },
    sport: { type : Schema.Types.ObjectId, ref : 'Sport'},
    compType: { type: String, default: "", required: true },
    participants:[{ type: Schema.Types.ObjectId, ref: 'Team'}],
    players: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    levelAverage: { type: String, default : "" },
    clasification: [{ type: Schema.Types.ObjectId, ref: 'Clasification'}],
    starts: Date,
    finishes: Date,
    longitude: Number,
    latitude: Number,
    open: Boolean
})

tournamentSchema.statics.list = function(filter, limit, skip, fields, sort, callback){
    const query = Tournament.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    query.populate('players').exec(callback)
}

var Tournament = mongoose.model ('Tournament', tournamentSchema)
module.exports = Tournament