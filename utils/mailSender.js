'use_strict'

var nodemailer = require('nodemailer')
var config = require('../config')

function sendMail (mailOptions) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email,
            pass: config.emailpass
        }
    })

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err)
        } else {
            console.log(info)
        }
    })

}

exports.sendMail = sendMail