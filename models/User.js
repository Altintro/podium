"use_strict"

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    age: Number,
    email: String,
    pass: String,
    dateOfBirth: Date
})

userSchema.statics.list = function(filter, limit, skip, fields, sort, callback){
    const query = User.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    query.exec(callback)
}

var User = mongoose.model ('User', userSchema)
module.exports = User