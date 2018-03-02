"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema
const tournamentSchema = Schema({
    name: String,
    sport: String,
    compType: String,
    players:[{ type: Schema.Types.ObjectId, ref :'User' }],
    levelAverage: String,
    starts: Date,
    finishes: Date,
})

tournamentSchema.statics.list = function(filter, limit, skip, fields, sort, callback){
    const query = Tournament.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    query.populate('players').exec(callback)
    //query.exec(callback)
}

var Tournament = mongoose.model ('Tournament', tournamentSchema)
module.exports = Tournament