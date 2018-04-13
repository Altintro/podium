'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var shortid = require('shortid')

const {OAuth2Client} = require('google-auth-library');
const googleClientId = config.google_client_id
const client = new OAuth2Client(googleClientId);

exports.authRequired = (req,res,next) => {

  var token = req.headers['x-access-token']
  if(!token) return res.json({ auth: false, message: 'No token provided'})

  jwt.verify(token, config.secret, (err, decoded)=> {
    if (err) return res.json({ auth: false, message: 'Failed to authenticate token' })
    req.userId = decoded.id 
    next()
  })
}

exports.generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.secret, { expiresIn: 86400 })
}

exports.generateRefreshToken = (userId) => {
  return Date.now.toString + shortid.generate + userId
}

exports.generateAlias = (name) => {
  let alias = name.replace(/\s+/g, '') + shortid.generate()
  return alias.toLowerCase()
}

exports.verifyGoogleToken = (googleToken) => {

  return info = client.verifyIdToken({
    idToken: googleToken,
    audience: googleClientId})
}



