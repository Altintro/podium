"use_strict"

const mongoose = require('mongoose')

const tournamentSchema = mongoose.Schema({
    name: String,
    sport: String,
    type: String,
})

tournamentSchema.statics.list = function(filter, limit, skip, fields, sort, callback){
    const query = Tournament.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    query.exec(callback)
}

var Tournament = mongoose.model ('Tournament', tournamentSchema)
module.exports = Tournament