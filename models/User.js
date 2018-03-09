"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = Schema({
    name: { type: String, default : "" },
    alias: { type: String, default: "", index: { unique: true, dropDups: true } },
    pass: { type:String, default: "" },
    email: {type: String, default: "", index: { unique: true, dropDups: true}},
    image: {type: String, default: "" },
    gender: {type: String, default: "" },
    birthdate: Date,
    latitude: Number,
    longitude: Number,
    ranking: [{ sport: String, ranking: Number, points: Number }],
    tournamentsPlayed: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    tournamentsPlaying: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    tournamentsWon: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    tournamentsUpcoming: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    gamesPlayed: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    gamesPlaying: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    gamesWon: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    gamesUpcoming: [{ type: Schema.Types.ObjectId, ref: 'Game'}]
})

userSchema.statics.list = (filter, limit, skip, fields, sort, callback) => {
    const query = User.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields,'-pass')
    query.populate('gamesPlaying').exec(callback)
}

var User = mongoose.model ('User', userSchema)
module.exports = User