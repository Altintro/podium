"use_strict"

const mongoose = require('mongoose')
const config = require('../config')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const transporter = require('../lib/transporter').transporter
var Schema = mongoose.Schema

const userSchema = Schema({
    name: { type: String, default : "" },
    alias: { type: String, default: "", index: { unique: true, dropDups: true } },
    slug: { type: String, index: { unique: true, dropDups: true }},
    pass: { type: String, default: "" },
    email: { type: String, default: "", index: { unique: true, sparse: true, dropDups: true}},
    profilePic: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthdate:{ type: Date, default: Date.now() },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    ranking: [{ sport: String, ranking: Number, points: Number }],
    interests: [{ type: Schema.Types.ObjectId, ref: 'Sport' }],

    facebook: {
        id: { type: String, default: "", index: true },
        name: { type: String, default: "" },
        picture: { 
          data: { 
            url: { type: String, default: "" }
          }
        },
        email: { type: String, default: "" }
    },

    google: {
        sub: { type: String, default: "", index: true },
        name: { type: String, default: "" },
        picture: { type: String, default: "" },
        email: { type: String, default: ""}
    },

    hasPassword: { type: Boolean, default: false },
    mergedWithFacebook: { type: Boolean, default: false },
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

userSchema.methods.sendMagicLink = function(token) {
  const options = { 
    from: "no-reply@winatpodium.com",
    to: this.email,
    subject: 'Sign in to Podium!', // Subject line
    text: '${config.host}/magiclink/${token}',
    html: `
      <h1>Magic Link</h1>
      <p>Hello ${this.name}, welcome to Podium.</p>
      <p>Click on the link below to sign in!</p>
      <a href="${config.host}/magiclink?token=${token}">
      Magic link
      </a>`
  }
  return transporter.sendMail(options, (err,info) => {
    var log = err ? err: info
    console.log(log)
  })
}

userSchema.methods.downloadProfilePic = async function(url) {
  const imagePath = path.resolve('../public/images/users/' + this.slug)
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  }).catch((err) => {
    console.log(err)
  })

  if(!fs.existsSync(imagePath)) fs.mkdirSync(imagePath)
  const name = this.slug + 'profilePic.jpg'
  response.data.pipe(fs.createWriteStream(imagePath + '/' + name))
  this.profilePic = name
}

var User = mongoose.model ('User', userSchema)
module.exports = User