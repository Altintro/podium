"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const refreshTokenSchema = Schema({
  token: { type: String, default: '', index: { unique: true, dropDups: true } },
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
})

var RefreshToken = mongoose.model ('RefreshToken', refreshTokenSchema)
module.exports = RefreshToken