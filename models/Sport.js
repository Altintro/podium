"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const sportSchema = Schema({
    name: {type : String, default : ""},
    slug: {type: String, index: { unique: true, dropDups: true }},
    image: { type: String, default: "" } ,
    description: { type: String, default: ""},
    rules: { type: String, default: ""},
    popularity: { type: Number, default: 0 },
    activeTournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament'}],
    openTournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament'}],
    activeGames: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    openGames: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    ranking: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

var Sport = mongoose.model ('Sport', sportSchema)
module.exports = Sport