'use_strict'

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var config = require('../config')

exports.transporter = nodemailer.createTransport(smtpTransport({
  secure: true,
  service: 'SES',
  auth: {
    user: config.smtpUserName,
    pass: config.smtpPass
  }
}))
