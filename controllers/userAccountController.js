'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var bcrypt = require('bcryptjs')

const {OAuth2Client} = require('google-auth-library');
const googleClientId = config.google_client_id
const client = new OAuth2Client(googleClientId);


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
    var query = { email: req.query.email }
    const user = await User.findOne(query)
    if(!user) return res.status(404).json({ result: 'User does not exist with the requested email'})
    return res.status(200).json({ result: 'Email belongs to existing user' })
}

exports.checkAlias = async (req, res, next) => {
    var query = { alias: req.query.alias }
    const user = await User.findOne(query)
    if(!user) return res.status(404).json({ result: 'User does not exist with the requested alias' })
    return res.status(200).json({result: 'Alias belongs to existing user'})
}

exports.google = async (req,res,next) => {
    var googleToken = req.query.googleToken || 'xxx'
    const info = await client.verifyIdToken({
        idToken: googleToken,
        audience: googleClientId})
    const payload = info.payload
    var user = await User.findOne({ email: payload.email })
    if(user) {

        if(!user.mergedWithGoogle) {
            return res.status(403).json({ err: 'User must login with email' })
        } else {
            console.log('Google sign in!')
            var token = jwt.sign({id: user._id },
                config.secret, {
                expiresIn: 86400
            })
            return res.json({auth: true, token: token})
        }
 
    } else {
        console.log('Google Sign up!')
        user = await User.create({
            google: payload,
            hasPassword: false,
            mergedWithGoogle: true,
            email: payload.email,
            name: payload.name
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