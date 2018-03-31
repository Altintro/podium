"use_strict"

const mongoose = require('mongoose')

var Schema = mongoose.Schema

const userSchema = Schema({
    name: { type: String, default : "" },
    alias: { type: String, default: "", index: { unique: true, dropDups: true } },
    pass: { type:String, default: "" },
    email: { type: String, default: "", index: { unique: true, sparse: true, dropDups: true}},
    profilePic: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthdate:{ type: Date, default: Date.now() },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    ranking: [{ sport: String, ranking: Number, points: Number }],
    interests: [{ type: Schema.Types.ObjectId, ref: 'Sport' }],

    fb: {
        id: { type: String, default: "", index: true },
        name: { type: String, default: "" },
        picture: { type: String, default: "" },
        email: { type: String, default: "" }
    },

    google: {
        sub: { type: String, default: "", index: true },
        name: { type: String, default: "" },
        picture: { type: String, default: "" },
        email: { type: String, default: ""}
    },

    hasPassword: { type: Boolean, default: true },
    mergedWithFB: { type: Boolean, default: false },
    mergedWithGoogle: {type: Boolean, default: false},

    tournamentsPlayed: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    tournamentsPlaying: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    tournamentsWon: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],
    tournamentsUpcoming: [{ type: Schema.Types.ObjectId, ref :'Tournament' }],

    gamesPlayed: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    gamesPlaying: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    gamesWon: [{ type: Schema.Types.ObjectId, ref: 'Game'}],
    gamesUpcoming: [{ type: Schema.Types.ObjectId, ref: 'Game'}]
})

var User = mongoose.model ('User', userSchema)
module.exports = User