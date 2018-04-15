"use_strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

const revokedTokenSchema = Schema({
  token: { type: String, default: '', index: true }
})

var RevokedToken = mongoose.model ('RevokedToken', revokedTokenSchema)
module.exports = RevokedToken