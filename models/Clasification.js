"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const clasificationSchema = Schema({
    tournament: { type: Schema.Types.ObjectId, ref :'Tournament'},
    compType: String,
    chart: [{ type: Schema.Types.ObjectId, ref :'Game'}]
})

var Clasification = mongoose.model ('Clasification', clasificationSchema)
module.exports = Clasification