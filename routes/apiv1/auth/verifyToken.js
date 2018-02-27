'use_strict'

var jwt = require('jsonwebtoken')
var config = require('../../../config')

module.exports = (req,res,next) => {
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