"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = Schema({
    name: String,
    userName: String,
    pass: String,
    email: String,
    image: String,
    gender: String,
    birthdate: Date,
    latitude: Number,
    longitude: Number,
    ranking: [{ sport: String, ranking: Number}],
    played: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    playing: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    won: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    upcoming: [{ type: Schema.Types.ObjectId, ref :'Tournament' }]
})

userSchema.statics.list = (filter, limit, skip, fields, sort, callback) => {
    const query = User.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    query.populate('playing').exec(callback)
}

var User = mongoose.model ('User', userSchema)
module.exports = User