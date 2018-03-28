'use_strict'

var nodemailer = require('nodemailer')
var config = require('../config')

exports.sendMagicLink =  (email, token) => {
  const mailOptions = {
    from: 'winatpodium@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Sign in to Podium!', // Subject line
      html: `
        <h1>Magic Link 🏄🏽‍</h1>
        <a href="${config.host}/magiclink/${token}">
        Click here for magic!
        </a>
              `,
      text: `Magic link: ${config.host}/apiv1/users/me?token=${token}`
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
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