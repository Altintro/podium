'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var bcrypt = require('bcryptjs')

const User = require('../models/User')

exports.register = (req,res, next) => {
    var hashedPassword = bcrypt.hashSync(req.body.pass, 8)
    User.create({

        name: req.body.name,
        alias: req.body.alias,
        email: req.body.email,
        pass: hashedPassword

    }).then((user) => {
        console.log(config.secret)
        var token = jwt.sign({id: user._id },
            config.secret, {
            expiresIn: 86400 //expires in 24 hours
        })
        return res.json({auth: true, token: token})
    }).catch((err) => {
        return next(err)
    })
}

exports.me = (req,res, next) => {
    console.log(req.userId)
    User.findById(req.userId)
        .select('-pass')
        .then((user) => {
            if(!user) { 
                return res.json({error: 'No user found'})
            }
            return res.json({me: user})
        }).catch((err) => {
            return next(err)
        })
}

exports.login = (req, res, next) => {
    var query = { email : req.body.email }
    User.findOne(query)
        .then((user) => {
            if(!user){
                return res.json({ error: 'User not found' })
            }
            var passwordIsValid = bcrypt.compareSync(req.body.pass, user.pass)

            if(!passwordIsValid){
                return res.json({auth: false, token: null})
            }
    
            var token = jwt.sign({id: user._id}, config.secret, { expiresIn: 86400 })

            return res.json({ auth: true, token: token})

        }).catch((err) => {
            return next(err)
        })
}

