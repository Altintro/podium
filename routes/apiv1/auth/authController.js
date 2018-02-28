'use_strict'


var express = require ('express')
var router = express.Router()
const User = require('../../../models/User')
var verifyToken = require('./verifyToken')

var jwt = require('jsonwebtoken')
var config = require('../../../config')
var bcrypt = require('bcryptjs')

// register
router.post('/register', (req,res) => {
    console.log(req.body)
    var hashedPassword = bcrypt.hashSync(req.body.pass, 8)

    User.create({

        name: req.body.name,
        username: req.body.username,
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
})

// Me
router.get('/me',verifyToken, (req,res) => {
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
})


// Login 
router.post('/login', (req, res) => {
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
})

module.exports = router