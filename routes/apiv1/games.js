'use_strict'

var express = require('express')
var router = express.Router()
const Game = require('../../models/Game')
var verifyToken = require('./auth/verifyToken')
var gameController = require('../../controllers/gameController')

// Get games
router.get('/',verifyToken,gameController.get)

// Post games
router.post('/',verifyToken,gameController.post)

module.exports = router