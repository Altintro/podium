'use_strict'

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var config = require('../config')

const transporter = nodemailer.createTransport(smtpTransport({
  secure: true,
  service: 'SES',
  auth: {
    user: config.smtpUserName,
    pass: config.smtpPass
  }
}))

exports.sendMagicLink =  (user, token) => {

  const mailOptions = {
    from: 'no-reply@winatpodium.com', 
    to: user.email, // list of receivers
    subject: 'Sign in to Podium!', // Subject line
    text: '${config.host}/magiclink/${token}',
    html: `
      <h1>Magic Link</h1>
      <p>Hello ${user.name}, welcome to Podium.</p>
      <p>Click on the link below to sign in!</p>
      <a href="${config.host}/magiclink?token=${token}">
      Magic link
      </a>`
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err)
    } else {
      console.log(info)
    }
  })
}