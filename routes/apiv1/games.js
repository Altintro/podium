'use_strict'

var express = require('express')
var router = express.Router()
var verifyToken = require('./auth/verifyToken')
var gameController = require('../../controllers/gameController')

router.get('/',verifyToken,gameController.getGames)

router.post('/',verifyToken,gameController.postGame)

router.post('/signup/:id',verifyToken,gameController.signUpGame)

router.delete('/:id',verifyToken,gameController.deleteGame)

module.exports = router