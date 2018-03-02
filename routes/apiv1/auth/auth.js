'use_strict'

var express = require ('express')
var router = express.Router()
var authController = require('../../../controllers/authController')
var verifyToken = require('./verifyToken')

router.post('/register', authController.register)
router.post('/login',authController.login )
router.get('/me',verifyToken, authController.me)

module.exports = router