'use_strict'

const jwt = require('jsonwebtoken')
const config = require('../config')
const bcrypt = require('bcryptjs')
const mailSender = require('./../utils/mailSender')
const slug = require('slug')

const auth = require('./authController')
const User = require('../models/User')

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
  const token = jwt.sign({id: user._id}, config.secret, { expiresIn: 86400 })
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

  const info = await auth.verifyGoogleToken(req.query.googleToken)
  const payload = info.payload
  let user = await User.findOne({ email: payload.email })

  if(user) {

    if(!user.mergedWithGoogle) {
      return res.status(405).json({ auth: 'other' })
    } else {
      const token = jwt.sign({id: user._id },
        config.secret, {
        expiresIn: 86400})
      return res.status(200).json({ auth: true, token: token })
    }  

  } else {
    const alias = auth.generateAlias(payload.name)
    user = await User.create({
      google: payload,
      hasPassword: false,
      mergedWithGoogle: true,
      email: payload.email,
      name: payload.name,
      alias: alias,
      slug: slug(alias)
    })
    const token = jwt.sign({ id: user._id },
      config.secret, {
      expiresIn: 86400})
    return res.status(201).json({auth: true, token: token})
  }
}

exports.email = async (req, res, next) => { 
  const email = req.query.email.trim()
  const user = await User.findOne({ email : email })
  if(user){
    if(!user.mergedWithGoogle && !user.mergedWithFB ) {
      // Magic link login
      const token = jwt.sign({id: user._id}, config.secret, { expiresIn: 86400 })
      mailSender.sendMagicLink(user, token)
      return res.status(200).json({ auth : true })
    } else {
      // Use other sign in method
      return res.status(405).json({ auth: 'other'})
    }
  } else {
    // Go to Registration
    return res.status(202).json({ auth: false })
  }
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
  const token = jwt.sign({id: user._id },
    config.secret, {
    expiresIn: 86400 //expires in 24 hours
  })
  mailSender.sendMagicLink(user, token)
  return res.json({ auth: true })
}

exports.me = async (req, res, next) => {
  const user = await User.findById(req.userId)
  if(user) return res.status(200).json(user)
  return res.status(404).json({ success: false })
}