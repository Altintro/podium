'use_strict'

var express = require('express')
var router = require('express-promise-router')()
var sportsController = require('../../controllers/sportsController')
var authRequired = require('../../controllers/authController').authRequired

router.get('/',sportsController.getSports)
router.post('/',sportsController.postSport)

module.exports = router