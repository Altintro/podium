'use_strict'

var jwt = require('jsonwebtoken')
var googleVerify = require('google-id-token-verifier')
var config = require('../config')

function verifyToken(req,res,next) {
    var token = req.headers['x-access-token']
    if(!token) {
        res.json({auth: false, message: 'No token provided'})
        return
    }

    jwt.verify(token, config.secret, (err,decoded)=> {
        if(err){
            res.json({auth: false, message: 'Failed to authenticate token'})
            return
        }
        //If token is provided and correct, save to request for use in other routes
        req.userId = decoded.id 
        next()
    })
}

function verifyGoogleToken(req,res,next) {
    var googleToken = req.query.googleToken
    if(!googleToken) {
        res.json({auth: false, message: 'No google token provided'})
        return
    }
    googleVerify.verify(googleToken, config.google_client_id, (err, info) => {
        if(err) {
            res.json({auth: false, message: 'Failed to authenticate Google token'})
            return
        }
        req.googleInfo = info
        next()
    })
}

exports.verifyToken = verifyToken
exports.verifyGoogleToken = verifyGoogleToken

