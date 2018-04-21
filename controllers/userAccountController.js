'use_strict'
 
const config = require('../config')
const bcrypt = require('bcryptjs')
const slug = require('slug')
const axios = require('axios')

const auth = require('./authController')
const User = require('../models/User')
const Sport = require('../models/Sport')
const RevokedToken = require('../models/RevokedToken')

function generateAuthResponse(req, res, refresh) {
  const accessToken = auth.generateAccessToken(req.userId)
  const refreshToken = refresh ? auth.generateRefreshToken(req.userId) : undefined
  return res.json({ 
    auth: true,
    type: res.type,
    accessToken: accessToken,
    refreshToken: refreshToken })  
}

exports.mapBasicUser = (user) => {
  return {
    _id: user.id,
    alias: user.alias,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic
    }
}

// Deprecate
exports.login = async (req, res, next) => {
  const query = { email : req.body.email }
  const user = await User.findOne(query)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const token = auth.generateAccessToken(user._id)
  return res.status(200).json({auth: true, accessToken: token})
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
  res.status(200)
  res.type = 'signin'
  const info = await auth.verifyGoogleToken(req.query.googleToken)
  const payload = info.payload
  let user = await User.findOne({ email: payload.email })
  console.log(payload.name)
  if(!user){
    res.type = 'signup'
    res.status(201)
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
  } else if (!user.mergedWithGoogle){
    user.google = payload
    user.mergedWithGoogle = true
    await user.save()
  }
  return generateAuthResponse(req, res, true) 
}

exports.facebook = async (req,res,next) => {
  res.status(200)
  res.type = 'signin'
  const payload = await auth.verifyFacebookToken(req.query.fbToken)
  const fb = payload.data
  let user = await User.findOne({ email:fb.email })

  if(!user) {
    res.status(201)
    res.type = 'signup'
    const alias = auth.generateAlias(fb.name)
    user = await User.create({
      facebook: fb,
      hasPassword: false,
      mergedWithFacebook: true,
      name: fb.name,
      alias: alias,
      email: fb.email,
      slug: slug(alias)
    })
  } else if(!user.mergedWithFacebook) {
    user.facebook = fb
    user.mergedWithFacebook = true
    await user.save()
  }
  return generateAuthResponse(req, res, true)
}

exports.socialRegisterUserUpdate = async (req, res, next) => {
  const user = await User.findById(req.userId)
  const alias = req.query.alias
  let sports = req.query.sports
  if (sports) {
    sports = sports.split(',')
    sports = await Sport.find({slug :sports})
    user.interests = sports.map((sport) => {
      return sport._id
    })
  }
  if(alias) { user.alias = alias }
  await user.save()
  return res.status(200).json({ auth: true })
}


exports.email = async (req, res, next) => { 
  const email = req.query.email.trim()
  const user = await User.findOne({ email : email })
  if(!user) return res.status(202).json({ auth: false })

  const magicToken = auth.generateMagicLinkToken(user._id)
  user.sendMagicLink(magicToken)
  return res.status(200).json({ auth : true })
}

exports.emailRegister = async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    alias: req.body.alias.toLowerCase().trim(),
    email: req.body.email.trim(),
    slug: slug(req.body.alias.toLowerCase())
  })
  const magicToken = auth.generateMagicLinkToken(user._id)
  user.sendMagicLink(magicToken)
  return res.json({ auth: true })
}

exports.tokens = async (req, res, next) => {
  const user = await User.findById(req.userId)
  if(!user) return res.status(400).json({ auth: false })
  return generateAuthResponse(req, res.status(200), true)
}

exports.refreshToken = async (req, res, next) => {
  const revokedToken = await RevokedToken.findOne({ token : req.refreshToken })
  if (revokedToken) return res.status(401).json({ auth: false  })
  return generateAuthResponse(req, res.status(200), false)
}




