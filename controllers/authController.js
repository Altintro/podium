'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var shortid = require('shortid')
var axios = require('axios')

const {OAuth2Client} = require('google-auth-library');
const googleClientId = config.google_client_id
const client = new OAuth2Client(googleClientId);

exports.authRequired = (req,res,next) => {
  const token = req.headers['x-access-token']
  if(!token) return res.status(400).json({ auth: false, message: 'No token provided'})

  jwt.verify(token, config.secret, (err, decoded)=> {
    if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token' })
    req.userId = decoded.id
    next()
  })
}

exports.authRefreshRequired = (req, res, next) => {
  const token = req.headers['x-refresh-token']
  if(!token) return res.status(400).json({ auth: false, message: 'No token provided'})

  jwt.verify(token, config.secret, (err, decoded)=> {
    if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token' })
    req.userId = decoded.id 
    req.refreshToken = token
    next()
  })
}

exports.generateAccessToken = (userId) => { // 60 minutes
  return jwt.sign({ id: userId }, config.secret , { expiresIn: 3600 })
}

exports.generateRefreshToken = (userId) => { // Does not expire
  return jwt.sign({ id: userId }, config.secret)
}

exports.generateMagicLinkToken = (userId) => { // 15 minutes
  return jwt.sign({ id: userId }, config.secret, { expiresIn: 900 })
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

exports.verifyFacebookToken = (fbToken) => {
  let url = 'https://graph.facebook.com/me?fields=email,name,picture,birthday&access_token=' + fbToken
  return axios.get(url)
}






