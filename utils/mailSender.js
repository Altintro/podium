'use_strict'

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var config = require('../config')

exports.sendMagicLink =  (user, token) => {

  const mailOptions = {
    from: 'no-reply@winatpodium.com', // sender address
      to: user.email, // list of receivers
      subject: 'Sign in to Podium!', // Subject line
      html: `
        <h1>Magic Link</h1>
        <p>Hello ${user.name}, welcome to Podium.</p>
        <p>Click on the link below to sign in!</p>
        <a href="${config.host}/magiclink/${token}">
        Magic link
        </a>
              `
  }

  const transporter = nodemailer.createTransport(smtpTransport({
    secure: true,
    service: 'SES',
    auth: {
      user: config.smtpUserName,
      pass: config.smtpPass
    }
  }))

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err)
    } else {
      console.log(info)
    }
  })

}