"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const clasificationSchema = Schema({
    game: { type: Schema.Types.ObjectId, ref: 'Game'},
    round: { type: Number, default: 0 },
    match: { type: Number, default: 0 }
})

var Clasification = mongoose.model ('Clasification', clasificationSchema)
module.exports = Clasification