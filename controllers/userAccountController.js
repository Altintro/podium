'use_strict'
 
const config = require('../config')
const bcrypt = require('bcryptjs')
const slug = require('slug')

const auth = require('./authController')
const mailSender = require('../utils/mailSender')
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')

function mapBasicUser(user) {
  return {
    _id: user.id,
    alias: user.alias,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic
    }
}

exports.mapBasicUser = mapBasicUser

// Deprecate
exports.login = async (req, res, next) => {
  const query = { email : req.body.email }
  const user = await User.findOne(query)
  if (!user) return res.status(404).json({ error: 'User not found' })
  // password check when login with password
  // const passwordIsValid = bcrypt.compareSync(req.body.pass, user.pass)
  // if(!passwordIsValid) return res.status(403).json({ error: 'Not Authorized' })
  const token = auth.generateAccessToken(user._id)
  const refresh = auth.generateRefreshToken(user._id)
  return res.status(200).json({auth: true, token: token})
}

exports.checkEmail = async (req, res, next) => {

  const type = req.query.type
  const query = { email: req.query.email }
  const user = await User.findOne(query)
  if(!user) return res.status(404).json({ exists: false })
  return res.status(200).json({ exists: true })
}

exports.checkAlias = async (req, res, next) => {

  const query = { alias: req.query.alias }
  const user = await User.findOne(query)
  if(!user) return res.status(404).json({ exists: false })
  return res.status(200).json({ exists: true })
}

exports.google = async (req,res,next) => {
  let status
  const info = await auth.verifyGoogleToken(req.query.googleToken)
  const payload = info.payload
  let user = await User.findOne({ email: payload.email })
  
  if(user && !user.mergedWithGoogle) {
    status = 200
    user.google = payload
    user.mergedWithGoogle = true
    await user.save()
  } else {
    status = 201
    const alias = auth.generateAlias(payload.name)
    user = await User.create({
      google: payload,
      hasPassword: false,
      mergedWithGoogle: true,
      name: payload.name,
      alias: alias,
      email: payload.email,
      slug: slug(alias)
    })
  }
  const accessToken = auth.generateAccessToken(user._id)
  const refreshToken = auth.generateRefreshToken(user._id)
  return res.status(status).json({ auth: true, accessToken: accessToken, refreshToken: refreshToken }) 
}

exports.email = async (req, res, next) => { 
  const email = req.query.email.trim()
  const user = await User.findOne({ email : email })
  if(!user) return res.status(202).json({ auth: false })

  const magicToken = auth.generateMagicLinkToken(user._id)
  mailSender.sendMagicLink(user,magicToken)
  return res.status(200).json({ auth : true })
}

exports.emailRegister = async (req, res, next) => {
  // var hashedPassword = bcrypt.hashSync(req.body.pass, 8)
  const user = await User.create({
    name: req.body.name,
    alias: req.body.alias.toLowerCase().trim(),
    email: req.body.email.trim(),
    slug: slug(req.body.alias.toLowerCase())
    //pass: hashedPassword
  })
  const magicToken = auth.generateMagicLinkToken(user._id)
  mailSender.sendMagicLink(user,magicToken)
  return res.json({ auth: true })
}

exports.tokens = async (req, res, next) => {
  const user = await User.findById(req.userId)
  if(!user) return res.status(400).json({ auth: false })
  const accessToken = auth.generateAccessToken(req.userId)
  const refreshToken = await auth.generateRefreshToken(req.userId)
  return res.status(200).json({ auth: true,
    accessToken: accessToken,
    refreshToken: refreshToken.token })
}

exports.refreshToken = async (req, res, next) => {
  const query = { token : req.params.refreshToken }
  const refreshToken = await RefreshToken.findOne(query)
  if(!refreshToken) return res.status(401).json({ auth: false })
  const accessToken = auth.generateAccessToken()
  return res.status(200).json({ auth: true, token: accessToken})
}

exports.revokeTokens = async (req,res,next) => {
  const query = { user: req.userId }
  await RefreshToken.find(query).remove()
  return res.status(200).json({ success: true })
}



