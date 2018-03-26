'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var bcrypt = require('bcryptjs')
var mailSender = require('./../utils/mailSender')

var auth = require('./authController')
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
exports.register = async (req, res, next) => {

    var hashedPassword = bcrypt.hashSync(req.body.pass, 8)
    const user = await User.create({
        name: req.body.name,
        alias: req.body.alias,
        email: req.body.email,
        pass: hashedPassword
    })
    var token = jwt.sign({id: user._id },
        config.secret, {
        expiresIn: 86400 //expires in 24 hours
    })
    return res.json({ auth: true, token: token })
}

// Deprecate
exports.login = async (req, res, next) => {

    var query = { email : req.body.email }
    const user = await User.findOne(query)
    if (!user) return res.status(404).json({ error: 'User not found' })
    var passwordIsValid = bcrypt.compareSync(req.body.pass, user.pass)
    if(!passwordIsValid) return res.status(403).json({ error: 'Not Authorized' })
    var token = jwt.sign({id: user._id}, config.secret, { expiresIn: 86400 })
    return res.status(200).json({auth: true, token: token})
}

exports.checkEmail = async (req, res, next) => {

    const type = req.query.type
    var query = { email: req.query.email }
    const user = await User.findOne(query)
    if(!user) return res.status(404).json({ exists: false })
    return res.status(200).json({ exists: true })
}

exports.checkAlias = async (req, res, next) => {

    var query = { alias: req.query.alias }
    const user = await User.findOne(query)
    if(!user) return res.status(404).json({ exists: false })
    return res.status(200).json({ exists: true })
}

exports.google = async (req,res,next) => {

    const info = await auth.verifyGoogleToken(req.query.googleToken)
    const payload = info.payload
    var user = await User.findOne({ email: payload.email })

    if(user) {

        if(!user.mergedWithGoogle) {
            return res.status(403).json({ err: 'Use different sign-in' })
        } else {
            console.log('Google sign in!')
            var token = jwt.sign({id: user._id },
                config.secret, {
                expiresIn: 86400})
            return res.status(200).json({auth: true, token: token})
        }  
 
    } else {
        console.log('Google Sign up!')
        const alias = auth.generateAlias(payload.name)
        user = await User.create({
            google: payload,
            hasPassword: false,
            mergedWithGoogle: true,
            email: payload.email,
            name: payload.name,
            alias: alias
        })
        var token = jwt.sign({id: user._id },
        config.secret, {
        expiresIn: 86400})
        return res.json({auth: true, token: token})
    }
}

exports.facebook = async (req, res, next) => {
    // Facebook Registration/Login
}

exports.email = async (req, res, next) => {
    const email = req.query.email
    const user = await User.findOne({ email : email })

    if(user){
        if(!user.mergedWithGoogle && !user.mergedWithFB ) {
             // Magic link login
             var token = jwt.sign({id: user._id}, config.secret, { expiresIn: 86400 })
             mailSender.sendMagicLink(email, token)
             return res.status(200).json({exists: true})
        } else {
            // Let user know, he must sign-in
            // using another method
            return next(new Error('Use differnet sign-in'))
        }
    } else {
        // User does not exist
        // Show register view in app: Full name and alias
        return res.status(401).json({ exists: false })
    }
}

exports.emailRegister = async (req, res, next) => {
    // var hashedPassword = bcrypt.hashSync(req.body.pass, 8)
    const user = await User.create({
        name: req.body.name,
        alias: req.body.alias,
        email: req.body.email,
        //pass: hashedPassword
    })
    var token = jwt.sign({id: user._id },
        config.secret, {
        expiresIn: 86400 //expires in 24 hours
    })
    // Send magic link
    mailSender.sendMagicLink(req.body.email, token)
    return res.json({ success: true })
}

exports.me = async (req, res, next) => {
    const user = await User.findById(req.userId)
    if(user) return res.status(200).json(mapBasicUser(user))
    return res.status(404).json({ success: false })
}