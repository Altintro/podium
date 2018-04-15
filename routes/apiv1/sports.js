'use_strict'

var express = require('express')
var router = require('express-promise-router')()
var sportsController = require('../../controllers/sportsController')
var authRequired = require('../../controllers/authController').authRequired
var multer = require('multer')
var upload = multer({dest: '../public/images/sports/uploads/'})


router.get('/',sportsController.getSports)
router.post('/',sportsController.postSport)
router.post('/uploadImage/:id',upload.single('image'), sportsController.uploadSportImage)

module.exports = router