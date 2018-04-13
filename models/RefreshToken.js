"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const refreshTokenSchema = Schema({
  token: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'Sport' },
  revoken: {type: Boolean, default: false }
})

var RefreshToken = mongoose.model ('RefreshToken', refreshTokenSchema)
module.exports = RefreshToken