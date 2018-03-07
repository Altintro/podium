"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const gameSchema = Schema({
    name: {type: String, default: ""},
    sport: {type: Schema.Types.ObjectId, ref: 'Sport'},
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament'},
    participants: [{type: Schema.Types.ObjectId, ref: 'Team'}],
    wins: {type: Schema.Types.ObjectId, ref: 'Team'},
    loses: {type: Schema.Types.ObjectId, ref: 'Team'},
    concluded: Boolean,
    date: Date
})

gameSchema.statics.list = function(filter, limit, skip, fields, sort, callback){
    const query = Game.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    query.exec(callback)
}

var Game = mongoose.model ('Game', gameSchema)
module.exports = Game