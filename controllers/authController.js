'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../config')
var bcrypt = require('bcryptjs')

const User = require('../models/User')

exports.register = (req,res) => {
    console.log(req.body)
    var hashedPassword = bcrypt.hashSync(req.body.pass, 8)

    User.create({

        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        pass: hashedPassword

    }, (err,user) => {

        if(err){
            res.json({error: 'Error registering new user'})
            return
        }

        //Create a token
        var token = jwt.sign({id: user._id }, config.secret, {
            expiresIn: 86400 //expires in 24 hours
        })

        res.json({auth: true, token: token})
    })
}

exports.me = (req,res) => {
    User.findById(req.userId,
        {pass: 0}, //projection , so the password isn't showcased on a response
        (err,user) => {
            if(err){
                res.json({error: 'There was a problem finding the user'})
                return
            }

            if(!user) {
                res.json({error: 'No user found'})
                return
            }

            res.json({success: true, user: user})
        })
}

exports.login = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            res.json({ error: 'Server error when trying to find user matching email',
            email: req.body.email})
            return
        }
        if(!user){
            res.json({error: 'No user found'})
            return
        }
        //si existe el usuario con ese email, compruebo la contraseña
        var passwordIsValid = bcrypt.compareSync(req.body.pass, user.pass)
        if(!passwordIsValid){
            res.json({auth: false, toekn: null})
            return
        }

        var token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400
        })

        res.json({ auth: true, token: token})
    })
}

